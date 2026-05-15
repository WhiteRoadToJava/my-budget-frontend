import api from "./axios";

export const getTotalBalance = async () => {
  try {
    const response = await api.get("/user/total-balance/all-total-balance");
    return response.data;
  } catch (error) {
    console.error("Error fetching total balance:", error);
    throw error;
  }
};