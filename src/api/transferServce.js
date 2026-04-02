import api from './axios';

export const createTransfer = async (transferData) => {
  try {
    const response = await api.post('/user/transfer/execute',
      transferData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding transfer:", error);
    throw error;
  }
};