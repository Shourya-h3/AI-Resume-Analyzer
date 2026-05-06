import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          {/* Visual Effects Background */}
          <div className="bg-3d-grid"></div>
          <div className="ambient-glow" style={{ top: '-10%', left: '-10%' }}></div>
          <div className="ambient-glow" style={{ bottom: '-10%', right: '-10%' }}></div>
          
          {/* Floating 3D Shapes */}
          <div className="floating-shape" style={{ width: '300px', height: '300px', top: '10%', right: '10%', animationDelay: '0s' }}></div>
          <div className="floating-shape" style={{ width: '400px', height: '400px', bottom: '20%', left: '5%', animationDelay: '-5s' }}></div>
          <div className="floating-shape" style={{ width: '250px', height: '250px', top: '40%', left: '40%', animationDelay: '-10s' }}></div>
          
          <Navbar />
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/results/:id" element={<ResultsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={
                  <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
                    <h1 style={{ fontSize: '5rem', fontWeight: 900, opacity: 0.15 }}>404</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Page not found</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                } />
              </Routes>
            </Suspense>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
