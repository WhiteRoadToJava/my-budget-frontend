import api from './axios';

export const addIncomse  = async (incomseData) => {
  try {
    const response = await api.post('/user/incomse/add-incomse',
      incomseData);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};