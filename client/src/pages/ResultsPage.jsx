import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, Tag, Download, Share2, RefreshCw
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadges from '../components/SkillBadges';
import SuggestionPanel from '../components/SuggestionPanel';
import SkillGapChart from '../components/SkillGapChart';
import SkillGapAnalyzer from '../components/SkillGapAnalyzer';
import { getAnalysisById, generateCoverLetter } from '../services/analysisService';
import '../components/Components.css';
import './ResultsPage.css';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cover Letter state
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [letterError, setLetterError] = useState('');

  const handleGenerateCoverLetter = async () => {
    setGeneratingLetter(true);
    setLetterError('');
    try {
      const res = await generateCoverLetter(id);
      setCoverLetter(res.coverLetter);
    } catch (err) {
      setLetterError(err.response?.data?.message || 'Failed to generate cover letter.');
    } finally {
      setGeneratingLetter(false);
    }
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getAnalysisById(id);
        setAnalysis(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analysis.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper container">
        <div className="alert alert-error" style={{ maxWidth: 500, margin: '4rem auto' }}>
          {error}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const date = new Date(analysis.createdAt).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <motion.div
      className="results-page page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        {/* Header */}
        <div className="results-header">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Back
          </button>
          <div className="results-title-section">
            <h1 className="results-title">{analysis.jobTitle}</h1>
            <p className="results-meta">
              <FileText size={13} />
              {analysis.resumeFileName}
              <span className="history-sep">·</span>
              {date}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleGenerateCoverLetter}
              disabled={generatingLetter}
              style={{ background: 'var(--gradient-card)', border: '1px solid var(--violet)', color: 'var(--text-primary)' }}
            >
              {generatingLetter ? <div className="spinner" style={{width: 14, height: 14, borderWidth: 2, borderColor: 'var(--violet)'}}/> : '✨'} 
              {generatingLetter ? 'Generating...' : 'AI Cover Letter'}
            </button>
            <Link to="/" className="btn btn-primary btn-sm">
              <RefreshCw size={14} /> New Analysis
            </Link>
          </div>
        </div>

        {/* Top section: Score Gauge + Key Metrics */}
        <div className="results-top">
          <motion.div
            className="glass-card score-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="card-section-title">Match Score</h2>
            <ScoreGauge score={analysis.matchScore} />
            <div className="score-summary">
              <div className="summary-stat">
                <span className="summary-num" style={{ color: 'var(--emerald)' }}>
                  {analysis.matchedSkills?.length || 0}
                </span>
                <span className="summary-label">Matched</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-stat">
                <span className="summary-num" style={{ color: 'var(--rose)' }}>
                  {analysis.missingSkills?.length || 0}
                </span>
                <span className="summary-label">Missing</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-stat">
                <span className="summary-num" style={{ color: 'var(--indigo)' }}>
                  {analysis.suggestions?.length || 0}
                </span>
                <span className="summary-label">Tips</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ flex: 1, minWidth: 0 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SkillGapChart skillBreakdown={analysis.skillBreakdown} />
          </motion.div>
        </div>

        {/* AI Skill Gap Analyzer (Killer Feature) */}
        <SkillGapAnalyzer missingSkills={analysis.missingSkills} />

        {/* Cover Letter Section */}
        {(coverLetter || generatingLetter || letterError) && (
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '1.5rem', padding: '1.5rem' }}
          >
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <div className="section-icon section-icon-indigo">
                ✨
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>AI Cover Letter</h3>
            </div>
            
            {letterError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                {letterError}
              </div>
            )}
            
            {coverLetter && (
              <div style={{ position: 'relative' }}>
                <textarea 
                  readOnly 
                  value={coverLetter} 
                  style={{ 
                    width: '100%', 
                    minHeight: '300px', 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    resize: 'vertical'
                  }} 
                />
                <button 
                  className="btn btn-sm btn-secondary" 
                  style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                  onClick={() => navigator.clipboard.writeText(coverLetter)}
                >
                  Copy
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Keywords Section */}
        {(analysis.topKeywords?.job?.length > 0 || analysis.topKeywords?.resume?.length > 0) && (
          <motion.div
            className="glass-card keywords-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="section-header">
              <div className="section-icon section-icon-cyan">
                <Tag size={15} />
              </div>
              <h3 style={{ fontSize: '1rem' }}>Top Keywords</h3>
            </div>
            <div className="keywords-grid">
              <div>
                <p className="keywords-subtitle">From Job Description</p>
                <div className="skills-grid" style={{ marginTop: '0.5rem' }}>
                  {analysis.topKeywords.job?.map((k) => (
                    <span key={k} className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="keywords-subtitle">From Your Resume</p>
                <div className="skills-grid" style={{ marginTop: '0.5rem' }}>
                  {analysis.topKeywords.resume?.map((k) => (
                    <span key={k} className="badge badge-amber" style={{ fontSize: '0.75rem' }}>{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills + Suggestions */}
        <motion.div
          className="results-bottom"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SkillBadges
            matchedSkills={analysis.matchedSkills}
            missingSkills={analysis.missingSkills}
          />
          <SuggestionPanel suggestions={analysis.suggestions} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;
