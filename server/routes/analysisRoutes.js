const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { optionalAuth } = require('../middleware/authMiddleware');
const {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
  generateCoverLetterHandler
} = require('../controllers/analysisController');

// Accept resume (required PDF) + jobDescription (optional PDF) + body fields
const uploadFields = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 },
]);

router.post('/', optionalAuth, uploadFields, createAnalysis);
router.get('/', optionalAuth, getAnalyses);
router.get('/:id', optionalAuth, getAnalysisById);
router.delete('/:id', optionalAuth, deleteAnalysis);
router.post('/:id/cover-letter', optionalAuth, generateCoverLetterHandler);

module.exports = router;
