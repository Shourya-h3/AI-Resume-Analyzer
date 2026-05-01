import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AnalysisHistory from '../components/AnalysisHistory';
import { getAnalyses } from '../services/analysisService';
import '../components/Components.css';
import './HistoryPage.css';

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [error, setError] = useState('');

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAnalyses(page, 10);
      setAnalyses(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError('Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const handleDelete = (id) => {
    setAnalyses((prev) => prev.filter((a) => a._id !== id));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  return (
    <motion.div
      className="history-page page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        <div className="history-header">
          <div className="history-title-group">
            <div className="section-icon section-icon-indigo" style={{ width: 44, height: 44 }}>
              <History size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Analysis History</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {pagination.total} total analys{pagination.total !== 1 ? 'es' : 'is'}
              </p>
            </div>
          </div>
          <Link to="/" className="btn btn-primary btn-sm">
            <Plus size={15} /> New Analysis
          </Link>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <AnalysisHistory
          analyses={analyses}
          loading={loading}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <span className="pagination-info">
              Page {page} of {pagination.pages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HistoryPage;
