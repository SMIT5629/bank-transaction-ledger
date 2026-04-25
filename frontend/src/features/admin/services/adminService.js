import apiClient from '../../../shared/services/api';

export const adminService = {
  // Users Management
  getAllUsers: (filters = {}) => {
    return apiClient.get('/admin/users', { params: filters });
  },

  getUserById: (id) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  updateUser: (id, userData) => {
    return apiClient.put(`/admin/users/${id}`, userData);
  },

  deleteUser: (id) => {
    return apiClient.delete(`/admin/users/${id}`);
  },

  // Accounts Management
  getAllAccounts: (filters = {}) => {
    return apiClient.get('/admin/accounts', { params: filters });
  },

  getAccountById: (id) => {
    return apiClient.get(`/admin/accounts/${id}`);
  },

  updateAccount: (id, accountData) => {
    return apiClient.put(`/admin/accounts/${id}`, accountData);
  },

  // Transactions Management
  getAllTransactions: (filters = {}) => {
    return apiClient.get('/admin/transactions', { params: filters });
  },

  getTransactionById: (id) => {
    return apiClient.get(`/admin/transactions/${id}`);
  },

  updateTransaction: (id, transactionData) => {
    return apiClient.put(`/admin/transactions/${id}`, transactionData);
  },

  // Reports
  getSystemStats: () => {
    return apiClient.get('/admin/stats');
  },

  getSystemReport: (filters = {}) => {
    return apiClient.get('/admin/reports', { params: filters });
  },

  getAuditLogs: (filters = {}) => {
    return apiClient.get('/admin/audit-logs', { params: filters });
  },
};
