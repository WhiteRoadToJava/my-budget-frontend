import api from './axios';

export const addExpense = async (expenseData) => {
  try {
    const response = await api.post('/user/expense/add-expense', expenseData);
    return response.data; // Return the created expense data
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await api.patch(`/user/expense/update-expense/${expenseId}`, expenseData);
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};
export const getExpenseById = async (expenseId) => {
  try {
    const response = await api.get(`/user/expense/find-expense/${expenseId}`);
    return response.data;
  } catch (error) { 
    console.log(error);
    throw error;
  }
};
export const deleteExpense = async (expenseId) => {
  try {
    const response = await api.delete(`/user/expense/delete-expense/${expenseId}`); 
    return response.data;
  } catch (error) {
    console.error(`Error deleting expense with ID ${expenseId}:`, error);
    throw error;
  }
};