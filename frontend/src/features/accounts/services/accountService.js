import apiClient from '../../../shared/services/api';

export const accountService = {
  getAll: () => {
    return apiClient.get('/accounts');
  },

  getById: (id) => {
    return apiClient.get(`/accounts/${id}`);
  },

  create: (accountData) => {
    return apiClient.post('/accounts', accountData);
  },

  update: (id, accountData) => {
    return apiClient.put(`/accounts/${id}`, accountData);
  },

  delete: (id) => {
    return apiClient.delete(`/accounts/${id}`);
  },

  getTransactions: (accountId, filters = {}) => {
    return apiClient.get(`/accounts/${accountId}/transactions`, { params: filters });
  },

  getBalance: (accountId) => {
    return apiClient.get(`/accounts/${accountId}/balance`);
  },
};
