import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Tag } from 'lucide-react';

const SkillBadge = ({ skill, type, index }) => (
  <motion.span
    className={`badge ${type === 'matched' ? 'badge-matched' : 'badge-missing'}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.04, duration: 0.3 }}
    title={type === 'matched' ? `"${skill}" found in both resume and job description` : `"${skill}" required but missing in resume`}
  >
    {type === 'matched' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
    {skill}
  </motion.span>
);

const SkillBadges = ({ matchedSkills = [], missingSkills = [] }) => {
  return (
    <div className="skill-badges-container">
      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="section-header">
            <div className="section-icon section-icon-emerald">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Matched Skills</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {matchedSkills.length} skill{matchedSkills.length !== 1 ? 's' : ''} found in both documents
              </p>
            </div>
          </div>
          <div className="skills-grid">
            {matchedSkills.map((skill, i) => (
              <SkillBadge key={skill} skill={skill} type="matched" index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="section-header">
            <div className="section-icon section-icon-rose">
              <XCircle size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Missing Skills</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {missingSkills.length} skill{missingSkills.length !== 1 ? 's' : ''} required but not found in resume
              </p>
            </div>
          </div>
          <div className="skills-grid">
            {missingSkills.map((skill, i) => (
              <SkillBadge key={skill} skill={skill} type="missing" index={i} />
            ))}
          </div>
          {missingSkills.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              🎉 No missing skills detected!
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {matchedSkills.length === 0 && missingSkills.length === 0 && (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <Tag size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No recognizable skills extracted</p>
        </div>
      )}
    </div>
  );
};

export default SkillBadges;
