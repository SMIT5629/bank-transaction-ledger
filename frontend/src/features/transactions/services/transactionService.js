import apiClient from '../../../shared/services/api';

export const transactionService = {
  getAll: (filters = {}) => {
    return apiClient.get('/transactions', { params: filters });
  },

  getById: (id) => {
    return apiClient.get(`/transactions/${id}`);
  },

  create: (transactionData) => {
    return apiClient.post('/transactions', transactionData);
  },

  update: (id, transactionData) => {
    return apiClient.put(`/transactions/${id}`, transactionData);
  },

  delete: (id) => {
    return apiClient.delete(`/transactions/${id}`);
  },

  getByAccount: (accountId, filters = {}) => {
    return apiClient.get(`/accounts/${accountId}/transactions`, { params: filters });
  },

  getStats: (filters = {}) => {
    return apiClient.get('/transactions/stats', { params: filters });
  },

  export: (format = 'csv', filters = {}) => {
    return apiClient.get(`/transactions/export?format=${format}`, { params: filters });
  },
};
