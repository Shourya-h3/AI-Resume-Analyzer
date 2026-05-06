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
        <FiTrendingUp className="text-8xl text-indigo" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo/10 rounded-2xl flex items-center justify-center border border-indigo/20">
          <FiAlertCircle className="text-indigo text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Skill Gap Analysis</h3>
          <p className="text-xs text-text-dim uppercase tracking-widest font-bold">Critical Missing proficiencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missingSkills.slice(0, 4).map((skill, index) => (
          <div key={index} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo/30 transition-all flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-indigo uppercase tracking-[0.2em] mb-2 block">Gap Detected</span>
              <h4 className="text-lg font-bold text-white mb-3">{skill}</h4>
            </div>
            <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald text-xs font-bold uppercase tracking-tighter">
                <FiBookOpen />
                Recommended
              </div>
              <button className="text-[10px] font-black text-indigo hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                Courses <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
        <div className="flex -space-x-3">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-indigo/20 border-2 border-bg-primary flex items-center justify-center text-[10px] font-bold text-indigo">
              AI
            </div>
          ))}
        </div>
        <p className="text-xs text-text-dim italic">
          AI suggests these skills are required by <span className="text-white font-bold">92%</span> of similar {missingSkills[0] ? 'roles' : 'positions'}.
        </p>
      </div>
    </motion.div>
  );
};

export default SkillGapAnalyzer;
