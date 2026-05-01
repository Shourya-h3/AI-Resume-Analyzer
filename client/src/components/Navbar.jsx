import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, History, LogIn, LogOut, User, Menu, X, FileSearch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Analyze', icon: <FileSearch size={16} /> },
    { to: '/history', label: 'History', icon: <History size={16} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Brain size={20} />
          </div>
          <span className="brand-text">
            Resume<span className="brand-accent">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={14} />
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <User size={14} />
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-menu-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <hr className="divider" style={{ margin: '0.5rem 0' }} />
              {user ? (
                <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
                  <LogOut size={14} /> Sign out
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/login" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
