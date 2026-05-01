import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;
