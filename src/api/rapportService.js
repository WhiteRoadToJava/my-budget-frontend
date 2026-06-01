import api from "./axios";

export const getTransactionsBetweenTwoDates = async (fromDate, toDate) => {
  try {
    const response = await api.get(
      `user/accounts/search/${fromDate}/${toDate}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
