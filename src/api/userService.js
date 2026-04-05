import api from "./axios";

export const getTransfers = async () => {
  try {
    const response = await api.get("/user/transfer/all-transfers");
    return response.data;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
};