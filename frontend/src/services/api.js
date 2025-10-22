import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const inventoryAPI = {
  create: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get('/inventory/statistics');
    return response.data;
  },
};

export const userAPI = {
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  updateRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get('/users/statistics');
    return response.data;
  },
};

export default api;