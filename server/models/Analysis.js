const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resumeFileName: {
      type: String,
      default: 'resume.pdf',
    },
    jobTitle: {
      type: String,
      default: 'Unknown Position',
      trim: true,
    },
    jobDescriptionSource: {
      type: String,
      enum: ['pdf', 'text'],
      default: 'text',
    },
    resumeText: {
      type: String,
      default: '',
    },
    jobText: {
      type: String,
      default: '',
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    skillBreakdown: {
      technical: { type: Number, default: 0 },
      soft: { type: Number, default: 0 },
      tools: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    topKeywords: {
      resume: { type: [String], default: [] },
      job: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Index for fast queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ matchScore: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
