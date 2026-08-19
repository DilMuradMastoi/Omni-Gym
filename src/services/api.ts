import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('gym_auth_token');
      localStorage.removeItem('gym_auth_user');
      // Redirect if needed
    }
    return Promise.reject(error);
  }
);
