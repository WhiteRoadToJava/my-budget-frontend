import api from "./axios";

export const addAccount = async (accountData) => {
  try {
    const response = await api.post("/user/accounts/add-account", accountData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};
export const deleteAccount = async (accountId) => {
  try {
    const response = await api.delete(
      `/user/accounts/delete-account/${accountId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting account with ID ${accountId}:`, error);
    throw error;
  }
};
export const updateAccount = async (accountData) => {
  try {
    const response = await api.patch(
      "/user/accounts/update-account",
      accountData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

export const getAccounts = async () => {
  try {
    const response = await api.get("/user/accounts/all-accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const getAccountById = async (accountId) => {
  try {
    const response = await api.get(`/user/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching account with ID ${accountId}:`, error);
    throw error;
  }
};

export const getAllAccountTransactions = async (account) => {
  try {
    const response = await api.post(
      "/user/accounts/allaccount-transactions",
      account,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getAllIncomseAndExpensesTransactions = async () => {
  try {
    const response = await api.get("/user/accounts/all-incomse-and-expense-transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getAllTransations = async () => {
  try {
    const response = await api.get("/user/accounts/all-transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
