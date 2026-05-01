import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, Zap, ChevronRight, History } from 'lucide-react';
import UploadCard from '../components/UploadCard';
import { analyzeResume } from '../services/analysisService';
import './HomePage.css';

const Feature = ({ icon, title, description, delay }) => (
  <motion.div
    className="feature-card glass-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </motion.div>
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeResume(formData);
      navigate(`/results/${result.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="home-page page-wrapper">
      <div className="container">
        {/* Hero Section */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles size={14} />
            AI-Powered Resume Analysis
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Match Your Resume to{' '}
            <span className="gradient-text">Any Job</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Upload your resume and job description to get an instant AI-powered match score,
            identify missing skills, and receive personalized improvement suggestions.
          </motion.p>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="stat-item">
              <span className="stat-number">TF-IDF</span>
              <span className="stat-label">NLP Engine</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Skills Tracked</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">Real-time</span>
              <span className="stat-label">Analysis</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content: Upload + Features */}
        <div className="home-content">
          <div className="upload-section">
            {error && (
              <motion.div
                className="alert alert-error"
                style={{ marginBottom: '1.25rem' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            <UploadCard onSubmit={handleAnalyze} loading={loading} />
          </div>

          <div className="features-column">
            <Feature
              icon={<TrendingUp size={20} />}
              title="Smart Match Score"
              description="Our TF-IDF cosine similarity algorithm computes a precise match percentage between your resume and any job description."
              delay={0.3}
            />
            <Feature
              icon={<Zap size={20} />}
              title="Skill Gap Analysis"
              description="Instantly identify which required skills are missing from your resume and get category-level breakdown (technical, soft skills, tools)."
              delay={0.4}
            />
            <Feature
              icon={<Shield size={20} />}
              title="Actionable Suggestions"
              description="Receive targeted recommendations to improve your resume match score, including keywords to add and formatting tips."
              delay={0.5}
            />
            <Feature
              icon={<History size={20} />}
              title="Analysis History"
              description="All your analyses are saved. Track improvements over time and compare your resume against multiple job descriptions."
              delay={0.6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
