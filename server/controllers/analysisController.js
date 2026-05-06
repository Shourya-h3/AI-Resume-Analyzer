const { extractTextFromPDF } = require('../services/pdfParser');
const { analyzeMatch } = require('../services/matcher');
const Analysis = require('../models/Analysis');

/**
 * POST /api/analyses
 */
const createAnalysis = async (req, res) => {
  try {
    const { jobTitle, jobDescriptionText } = req.body;
    const files = req.files;

    if (!files || !files.resume || files.resume.length === 0) {
      return res.status(400).json({ message: 'Resume PDF is required' });
    }

    const resumeBuffer = files.resume[0].buffer;
    const resumeFileName = files.resume[0].originalname;
    const resumeText = await extractTextFromPDF(resumeBuffer);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Could not extract enough text from the resume PDF. Ensure it is not a scanned image.',
      });
    }

    let jobText = '';
    let jobDescriptionSource = 'text';

    if (files.jobDescription && files.jobDescription.length > 0) {
      jobText = await extractTextFromPDF(files.jobDescription[0].buffer);
      jobDescriptionSource = 'pdf';
    } else if (jobDescriptionText && jobDescriptionText.trim().length > 30) {
      jobText = jobDescriptionText.trim();
    } else {
      return res.status(400).json({
        message: 'Job description is required (either PDF upload or pasted text, minimum 30 characters)',
      });
    }

    const result = analyzeMatch(resumeText, jobText);

    const analysis = await Analysis.create({
      userId: req.user ? req.user._id : null,
      resumeFileName,
      jobTitle: jobTitle || 'Untitled Position',
      jobDescriptionSource,
      resumeText,
      jobText,
      ...result,
    });

    res.status(201).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ message: error.message || 'Analysis failed' });
  }
};

/**
 * GET /api/analyses
 */
const getAnalyses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = req.user ? { userId: req.user._id } : { userId: null };

    const [analyses, total] = await Promise.all([
      Analysis.find(filter)
        .select('-resumeText -jobText')
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
  } catch (error) {
    console.error('Get analyses error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch analyses' });
  }
};

/**
 * GET /api/analyses/:id
 */
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id).lean();

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Get analysis error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch analysis' });
  }
};

/**
 * DELETE /api/analyses/:id
 */
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (req.user && analysis.userId && analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this analysis' });
    }

    await analysis.deleteOne();
    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    console.error('Delete analysis error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to delete analysis' });
  }
};

/**
 * POST /api/analyses/:id/cover-letter
 */
const generateCoverLetterHandler = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (req.user && analysis.userId && analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this analysis' });
    }

    const { generateCoverLetter } = require('../services/geminiService');
    const coverLetter = await generateCoverLetter(analysis.resumeText, analysis.jobText, analysis.jobTitle);

    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Generate cover letter error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to generate cover letter' });
  }
};

module.exports = { createAnalysis, getAnalyses, getAnalysisById, deleteAnalysis, generateCoverLetterHandler };
