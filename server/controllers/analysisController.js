const asyncHandler = require('express-async-handler');
const { extractTextFromPDF } = require('../services/pdfParser');
const { analyzeMatch } = require('../services/matcher');
const Analysis = require('../models/Analysis');

/**
 * POST /api/analyze
 * Accepts: resume (PDF), jobDescription (PDF or text), jobTitle (string)
 */
const createAnalysis = asyncHandler(async (req, res) => {
  const { jobTitle, jobDescriptionText } = req.body;
  const files = req.files;

  // Validate resume PDF upload
  if (!files || !files.resume || files.resume.length === 0) {
    res.status(400);
    throw new Error('Resume PDF is required');
  }

  // Extract resume text
  const resumeBuffer = files.resume[0].buffer;
  const resumeFileName = files.resume[0].originalname;
  const resumeText = await extractTextFromPDF(resumeBuffer);

  if (!resumeText || resumeText.trim().length < 50) {
    res.status(400);
    throw new Error('Could not extract enough text from the resume PDF. Ensure it is not a scanned image.');
  }

  // Get job description text (from PDF or pasted text)
  let jobText = '';
  let jobDescriptionSource = 'text';

  if (files.jobDescription && files.jobDescription.length > 0) {
    jobText = await extractTextFromPDF(files.jobDescription[0].buffer);
    jobDescriptionSource = 'pdf';
  } else if (jobDescriptionText && jobDescriptionText.trim().length > 30) {
    jobText = jobDescriptionText.trim();
  } else {
    res.status(400);
    throw new Error('Job description is required (either PDF upload or pasted text, minimum 30 characters)');
  }

  // Run NLP matching
  const result = analyzeMatch(resumeText, jobText);

  // Save to MongoDB
  const analysis = await Analysis.create({
    userId: req.user ? req.user._id : null,
    resumeFileName,
    jobTitle: jobTitle || 'Untitled Position',
    jobDescriptionSource,
    resumeText,
    jobText,
    ...result,
  });

  res.status(201).json({
    success: true,
    data: analysis,
  });
});

/**
 * GET /api/analyses
 * Returns paginated list of analyses (for current user or all if anonymous)
 */
const getAnalyses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = req.user ? { userId: req.user._id } : { userId: null };

  const [analyses, total] = await Promise.all([
    Analysis.find(filter)
      .select('-resumeText -jobText') // Exclude heavy text fields from list
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Analysis.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: analyses,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

/**
 * GET /api/analyses/:id
 * Returns single analysis by ID
 */
const getAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id).lean();

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  res.json({ success: true, data: analysis });
});

/**
 * DELETE /api/analyses/:id
 */
const deleteAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);

  if (!analysis) {
    res.status(404);
    throw new Error('Analysis not found');
  }

  // Only allow deletion by owner or anonymous
  if (req.user && analysis.userId && analysis.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this analysis');
  }

  await analysis.deleteOne();
  res.json({ success: true, message: 'Analysis deleted' });
});

module.exports = { createAnalysis, getAnalyses, getAnalysisById, deleteAnalysis };
