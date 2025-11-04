import api from './api';

export const walletService = {
  addMoney: async (amount) => {
    const response = await api.post('/wallet/add', { amount });
    return response.data;
  },

  transferMoney: async (toEmail, amount) => {
    const response = await api.post('/wallet/transfer', { toEmail, amount });
    return response.data;
  },

  getTransactions: async (page = 0, size = 20) => {
    const response = await api.get('/wallet/transactions', {
      params: { page, size },
    });
    return response.data;
  },
};
