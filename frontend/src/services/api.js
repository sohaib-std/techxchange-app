import axios from 'axios';

// Base URL for API requests. Thanks to the proxy, we can use relative paths.
const API_BASE_URL = '/api';

// Create a configured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const productService = {
  // Get all products
  getAll: () => api.get('/products'),
  // Get a single product by ID
  getById: (id) => api.get(`/products/${id}`),
};

export const sellerService = {
  // Get all sellers
  getAll: () => api.get('/sellers'),
  // Get a single seller by ID
  getById: (id) => api.get(`/sellers/${id}`),
};

// Add more services for reviews, auth, etc. here later