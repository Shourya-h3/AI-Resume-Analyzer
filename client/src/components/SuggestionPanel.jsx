import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';

const SuggestionPanel = ({ suggestions = [] }) => {
  if (!suggestions.length) return null;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div className="section-header">
        <div className="section-icon section-icon-amber">
          <Lightbulb size={16} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Improvement Suggestions</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {suggestions.length} actionable recommendation{suggestions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="suggestions-list">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            className="suggestion-item"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <div className="suggestion-number">{i + 1}</div>
            <p className="suggestion-text">{suggestion}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionPanel;
