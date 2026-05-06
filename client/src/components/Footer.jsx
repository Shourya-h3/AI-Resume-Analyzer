import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '2rem',
      textAlign: 'center',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-muted)'
    }}>
      <p>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
