import apiClient from '../../../shared/services/api';

export const profileService = {
  getProfile: () => {
    return apiClient.get('/auth/profile');
  },

  updateProfile: (profileData) => {
    return apiClient.put('/auth/profile', profileData);
  },

  changePassword: (passwords) => {
    return apiClient.post('/auth/change-password', passwords);
  },

  updateSettings: (settings) => {
    return apiClient.put('/auth/settings', settings);
  },
};
