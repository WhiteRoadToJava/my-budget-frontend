import api from "./axios";

export const createTransfer = async (transferData) => {
  try {
    const response = await api.post("/user/transfer/execute", transferData);
    return response.data;
  } catch (error) {
    console.error("Error adding transfer:", error);
    throw error;
  }
};

export const getTransferById = async (transferId) => {
  try {
    const response = await api.get(`/user/transfer/find-transfer/${transferId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transfer with ID ${transferId}:`, error);
    throw error;
  }
};

export const updateTransfer = async (transferId, transferData) => {
  try {
    const response = await api.patch(`/user/transfer/update/${transferId}`, transferData);
    return response.data;
  } catch (error) {
    console.error(`Error updating transfer with ID ${transferId}:`, error);
    throw error;
  }
};


