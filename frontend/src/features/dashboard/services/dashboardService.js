import apiClient from '../../../shared/services/api';

export const dashboardService = {
  getStats: () => {
    return apiClient.get('/dashboard/stats');
  },

  getRecentTransactions: (limit = 10) => {
    return apiClient.get(`/dashboard/recent-transactions?limit=${limit}`);
  },

  getAccountSummary: () => {
    return apiClient.get('/dashboard/account-summary');
  },

  getMonthlyReport: (month, year) => {
    return apiClient.get(`/dashboard/monthly-report?month=${month}&year=${year}`);
  },
};
