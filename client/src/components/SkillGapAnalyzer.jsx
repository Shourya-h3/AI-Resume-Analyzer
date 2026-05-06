import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAlertCircle, FiBookOpen, FiArrowRight } from 'react-icons/fi';

const SkillGapAnalyzer = ({ missingSkills = [] }) => {
  if (missingSkills.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 mb-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <FiTrendingUp className="text-8xl" style={{ color: 'var(--primary)' }} />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
          <FiAlertCircle className="text-2xl" style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Skill Gap Analysis</h3>
          <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--text-secondary)' }}>Critical Missing proficiencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missingSkills.slice(0, 4).map((skill, index) => (
          <div key={index} className="p-5 rounded-2xl hover:border-primary transition-all flex flex-col justify-between" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block" style={{ color: 'var(--primary)' }}>Gap Detected</span>
              <h4 className="text-lg font-bold text-white mb-3">{skill}</h4>
            </div>
            <div className="pt-4 mt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter" style={{ color: 'var(--emerald)' }}>
                <FiBookOpen />
                Recommended
              </div>
              <button className="text-[10px] font-black transition-colors flex items-center gap-1 uppercase tracking-widest" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Courses <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex -space-x-3">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'var(--bg-primary)', color: 'var(--primary)' }}>
              AI
            </div>
          ))}
        </div>
        <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
          AI suggests these skills are required by <span className="text-white font-bold">92%</span> of similar {missingSkills[0] ? 'roles' : 'positions'}.
        </p>
      </div>
    </motion.div>
  );
};

export default SkillGapAnalyzer;
