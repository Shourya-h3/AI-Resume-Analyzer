import api from './api';

export const analyzeResume = async (formData) => {
  const response = await api.post('/analyses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60s for large PDFs
  });
  return response.data;
};

export const getAnalyses = async (page = 1, limit = 10) => {
  const response = await api.get(`/analyses?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/analyses/${id}`);
  return response.data;
};

export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/analyses/${id}`);
  return response.data;
};

export const generateCoverLetter = async (id) => {
  const response = await api.post(`/analyses/${id}/cover-letter`);
  return response.data;
};
