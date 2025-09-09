import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create a configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the authentication token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API service functions
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
};

export const sellerService = {
  getAll: () => api.get('/sellers'),
  getById: (id) => api.get(`/sellers/${id}`),
};

export const reviewService = {
  create: (reviewData) => api.post('/reviews', reviewData),
};

// NEW: Authentication services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  setToken: (token) => setAuthToken(token), // Export the token setter
};

export const newsService = {
    getTechNews: () => api.get('/news'),
};