import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <motion.div
        className="auth-card glass-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <div className="auth-logo">
            <Brain size={24} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join to save and track your resume analyses</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="input-field"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="register-password">Password</label>
            <div className="password-wrapper">
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength indicator */}
            <div className="progress-bar" style={{ height: 4 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: password.length === 0 ? '0%'
                    : password.length < 6 ? '30%'
                    : password.length < 10 ? '60%' : '100%',
                  background: password.length < 6 ? 'var(--rose)'
                    : password.length < 10 ? 'var(--amber)' : 'var(--emerald)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            id="register-submit-btn"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account...</>
            ) : (
              <><UserPlus size={17} /> Create Account</>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </p>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Continue without an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
