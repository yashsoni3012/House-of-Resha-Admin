import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Banner APIs
export const bannerAPI = {
  getAll: () => api.get('/banner'),
  create: (formData) =>
    api.post('/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id, formData) =>
    api.patch(`/banner/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  delete: (id) => api.delete(`/banner/${id}`),
};

export default api;