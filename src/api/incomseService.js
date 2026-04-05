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
export const deleteIncomse = async (incomseId) => {
  try {
    const response = await api.delete(`/user/incomse/delete-incomse/${incomseId}`); 
    return response.data;
  } catch (error) {
    console.error(`Error deleting incomse with ID ${incomseId}:`, error);
    throw error;
  }
};
export const updateIncomse = async (incomseId, incomseData) => {
  try {
    const response = await api.patch(`/user/incomse/update-incomse/${incomseId}`, incomseData);
    return response.data;
  } catch (error) {
    console.error("Error updating incomse:", error);
    throw error;
  }
};

export const getIncomseById = async (incomseId) => {
  try {
    const response = await api.get(`/user/incomse/find-incomse/${incomseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching incomse with ID ${incomseId}:`, error);
    throw error;
  }
};
