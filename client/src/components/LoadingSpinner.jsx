import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="loading-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      width: '100%'
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid var(--primary-color)',
          borderRadius: '50%',
          marginBottom: '1rem'
        }}
      />
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
