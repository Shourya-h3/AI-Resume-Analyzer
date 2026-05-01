import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Trash2, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { deleteAnalysis } from '../services/analysisService';

const getScoreColor = (score) => {
  if (score >= 80) return 'var(--emerald)';
  if (score >= 60) return 'var(--cyan)';
  if (score >= 40) return 'var(--amber)';
  return 'var(--rose)';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

const AnalysisRow = ({ analysis, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const color = getScoreColor(analysis.matchScore);
  const date = new Date(analysis.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis?')) return;
    setDeleting(true);
    try {
      await deleteAnalysis(analysis._id);
      onDelete(analysis._id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      className="history-row glass-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={() => navigate(`/results/${analysis._id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Score badge */}
      <div className="history-score" style={{ color, borderColor: color + '40', background: color + '15' }}>
        <span className="history-score-num">{analysis.matchScore}%</span>
        <span className="history-score-label">{getScoreLabel(analysis.matchScore)}</span>
      </div>

      {/* Info */}
      <div className="history-info">
        <p className="history-title">{analysis.jobTitle || 'Untitled Position'}</p>
        <p className="history-meta">
          <span className="history-filename">{analysis.resumeFileName}</span>
          <span className="history-sep">·</span>
          <Clock size={11} />
          {date}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          {analysis.matchedSkills?.slice(0, 3).map((s) => (
            <span key={s} className="badge badge-matched" style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem' }}>{s}</span>
          ))}
          {(analysis.matchedSkills?.length || 0) > 3 && (
            <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem' }}>
              +{analysis.matchedSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="history-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/results/${analysis._id}`)}
          title="View results"
        >
          <Eye size={14} />
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

const AnalysisHistory = ({ analyses, loading, onDelete, compact = false }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!analyses?.length) {
    return (
      <div className="empty-state glass-card" style={{ padding: '3rem' }}>
        <TrendingUp size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.4 }} />
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No analyses yet</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Upload your resume to get started!
        </p>
      </div>
    );
  }

  const displayedAnalyses = compact ? analyses.slice(0, 5) : analyses;

  return (
    <div className="history-list">
      <AnimatePresence mode="popLayout">
        {displayedAnalyses.map((analysis) => (
          <AnalysisRow key={analysis._id} analysis={analysis} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnalysisHistory;
