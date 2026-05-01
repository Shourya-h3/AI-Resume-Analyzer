import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './ScoreGauge.css';

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // emerald
  if (score >= 60) return '#06b6d4'; // cyan
  if (score >= 40) return '#f59e0b'; // amber
  return '#f43f5e';                   // rose
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Needs Work';
};

const ScoreGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 80; // r=80
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const countRef = useRef(null);

  useEffect(() => {
    // Animate the number counter
    let start = 0;
    const duration = 1400;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        current = score;
        clearInterval(timer);
      }
      if (countRef.current) {
        countRef.current.textContent = Math.round(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <motion.div
      className="score-gauge-wrapper"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="score-gauge">
        <svg viewBox="0 0 200 200" className="gauge-svg">
          {/* Background glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor={color}/>
            </linearGradient>
          </defs>

          {/* Track ring */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Score arc */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 100 100)"
            filter="url(#glow)"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Center text */}
        <div className="gauge-center">
          <div className="gauge-score-row">
            <span ref={countRef} className="gauge-number" style={{ color }}>
              0
            </span>
            <span className="gauge-percent" style={{ color }}>%</span>
          </div>
          <span className="gauge-label" style={{ color }}>{label}</span>
        </div>
      </div>

      {/* Score interpretation bar */}
      <div className="score-bar-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#f43f5e' }} />
          <span>0–39</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#f59e0b' }} />
          <span>40–59</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#06b6d4' }} />
          <span>60–79</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#10b981' }} />
          <span>80–100</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreGauge;
