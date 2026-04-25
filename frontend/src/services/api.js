import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  },
};

// Account APIs
export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  getAccountById: (id) => api.get(`/accounts/${id}`),
  createAccount: (accountData) => api.post('/accounts', accountData),
  updateAccount: (id, accountData) => api.put(`/accounts/${id}`, accountData),
  deleteAccount: (id) => api.delete(`/accounts/${id}`),
  getAllAccounts: () => api.get('/accounts/admin/all'), // For admin
};

// Transaction APIs
export const transactionAPI = {
  getTransactions: (accountId) => api.get(`/transactions?accountId=${accountId}`),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  updateTransaction: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  getAllTransactions: () => api.get('/transactions/admin/all'), // For admin
};

// User APIs (Admin only)
export const userAPI = {
  getAllUsers: () => api.get('/auth/users'),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export default api;
