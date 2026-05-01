import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const COLORS = {
  technical: '#6366f1',
  soft: '#10b981',
  tools: '#06b6d4',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(17,17,24,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '0.625rem 0.875rem',
        fontSize: '0.85rem',
      }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{label}</p>
        <p style={{ color: 'white', fontWeight: 700 }}>{payload[0].value}% match</p>
      </div>
    );
  }
  return null;
};

const SkillGapChart = ({ skillBreakdown }) => {
  if (!skillBreakdown) return null;

  const data = [
    { name: 'Technical', value: skillBreakdown.technical || 0, color: COLORS.technical },
    { name: 'Soft Skills', value: skillBreakdown.soft || 0, color: COLORS.soft },
    { name: 'Tools', value: skillBreakdown.tools || 0, color: COLORS.tools },
    { name: 'Overall', value: skillBreakdown.total || 0, color: '#f59e0b' },
  ];

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div className="section-header">
        <div className="section-icon section-icon-indigo">
          <BarChart2 size={16} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Skill Gap Analysis</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Category breakdown of skill alignment
          </p>
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div style={{ height: 220, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} opacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Percentage summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
        {data.map((item) => (
          <motion.div
            key={item.name}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: data.indexOf(item) * 0.1 }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.name}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color }}>{item.value}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                style={{ background: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillGapChart;
