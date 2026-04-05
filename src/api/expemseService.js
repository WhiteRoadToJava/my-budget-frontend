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
export const deleteExpense = async (expenseId) => {
  try {
    const response = await api.delete(`/user/expense/delete-expense/${expenseId}`); 
    return response.data;
  } catch (error) {
    console.error(`Error deleting expense with ID ${expenseId}:`, error);
    throw error;
  }
};