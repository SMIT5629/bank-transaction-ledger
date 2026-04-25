import apiClient from '../../../shared/services/api';

export const authService = {
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },

  logout: () => {
    return apiClient.post('/auth/logout');
  },

  updateProfile: (userData) => {
    return apiClient.put('/auth/profile', userData);
  },

  changePassword: (passwords) => {
    return apiClient.post('/auth/change-password', passwords);
  },
};
