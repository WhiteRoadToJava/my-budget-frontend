import api from './axios';

export const getAccounts = async () => {
  try {
    const response = await api.get('/user/accounts');
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};