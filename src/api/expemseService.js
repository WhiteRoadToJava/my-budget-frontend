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