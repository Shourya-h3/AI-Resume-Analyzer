import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import './UploadCard.css';

const UploadZone = ({ label, accept, file, onDrop, onRemove, id }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="upload-zone-wrapper">
      <label className="input-label">{label}</label>
      {file ? (
        <motion.div
          className="upload-file-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle size={20} className="preview-check" />
          <div className="preview-info">
            <span className="preview-name">{file.name}</span>
            <span className="preview-size">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
          <button
            className="preview-remove"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            type="button"
          >
            <X size={16} />
          </button>
        </motion.div>
      ) : (
        <div
          {...getRootProps()}
          className={`upload-dropzone ${isDragActive ? 'dragging' : ''}`}
          id={id}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <Upload size={24} />
            </div>
            <p className="dropzone-title">
              {isDragActive ? 'Drop it here!' : 'Drag & drop PDF'}
            </p>
            <p className="dropzone-sub">or <span className="dropzone-link">browse files</span></p>
            <p className="dropzone-hint">Max 5MB · PDF only</p>
          </div>
        </div>
      )}
    </div>
  );
};

const UploadCard = ({ onSubmit, loading }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jdMode, setJdMode] = useState('text'); // 'text' | 'pdf'
  const [error, setError] = useState('');

  const onDropResume = useCallback((accepted) => {
    if (accepted[0]) setResumeFile(accepted[0]);
  }, []);

  const onDropJD = useCallback((accepted) => {
    if (accepted[0]) setJdFile(accepted[0]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please upload your resume PDF.');
      return;
    }

    if (jdMode === 'pdf' && !jdFile) {
      setError('Please upload the job description PDF.');
      return;
    }

    if (jdMode === 'text' && jdText.trim().length < 30) {
      setError('Please enter a job description (at least 30 characters).');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobTitle', jobTitle || 'Untitled Position');
    if (jdMode === 'pdf') {
      formData.append('jobDescription', jdFile);
    } else {
      formData.append('jobDescriptionText', jdText);
    }

    onSubmit(formData);
  };

  return (
    <motion.div
      className="upload-card glass-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="upload-card-header">
        <div className="upload-card-icon">
          <FileText size={22} />
        </div>
        <div>
          <h2 className="upload-card-title">Analyze Your Resume</h2>
          <p className="upload-card-subtitle">Upload your resume and paste or upload a job description</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          <X size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Job Title */}
        <div className="input-group">
          <label className="input-label" htmlFor="job-title-input">Job Title (optional)</label>
          <input
            id="job-title-input"
            type="text"
            className="input-field"
            placeholder="e.g. Senior Frontend Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Resume Upload */}
        <UploadZone
          label="Resume PDF *"
          accept={{ 'application/pdf': ['.pdf'] }}
          file={resumeFile}
          onDrop={onDropResume}
          onRemove={() => setResumeFile(null)}
          id="resume-upload-zone"
        />

        {/* JD Mode Toggle */}
        <div className="jd-mode-toggle">
          <label className="input-label">Job Description *</label>
          <div className="toggle-tabs">
            <button
              type="button"
              className={`toggle-tab ${jdMode === 'text' ? 'active' : ''}`}
              onClick={() => { setJdMode('text'); setJdFile(null); }}
            >
              Paste Text
            </button>
            <button
              type="button"
              className={`toggle-tab ${jdMode === 'pdf' ? 'active' : ''}`}
              onClick={() => { setJdMode('pdf'); setJdText(''); }}
            >
              Upload PDF
            </button>
          </div>
        </div>

        {/* JD Input */}
        {jdMode === 'text' ? (
          <textarea
            id="jd-text-input"
            className="input-field"
            placeholder="Paste the full job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={8}
            style={{ resize: 'vertical' }}
          />
        ) : (
          <UploadZone
            label="Job Description PDF *"
            accept={{ 'application/pdf': ['.pdf'] }}
            file={jdFile}
            onDrop={onDropJD}
            onRemove={() => setJdFile(null)}
            id="jd-upload-zone"
          />
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="analyze-submit-btn"
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Analyzing...
            </>
          ) : (
            <>
              <FileText size={18} />
              Analyze Resume
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default UploadCard;
