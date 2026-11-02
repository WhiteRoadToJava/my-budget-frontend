import api from "./axios";

// All debt endpoints live under /api/user/debts (DebtController).
// Each function returns response.data and rethrows, like the other services,
// so components can read error.response.status (400, 404, 409).

export const getDebts = async () => {
  try {
    const response = await api.get("/user/debts/all-debts");
    return response.data;
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw error;
  }
};

// returns { debt, movements }
export const getDebt = async (debtId) => {
  try {
    const response = await api.get(`/user/debts/find-debt/${debtId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching debt ${debtId}:`, error);
    throw error;
  }
};

export const addDebt = async (debtData) => {
  try {
    const response = await api.post("/user/debts/add-debt", debtData);
    return response.data;
  } catch (error) {
    console.error("Error adding debt:", error);
    throw error;
  }
};

export const updateDebt = async (debtId, debtData) => {
  try {
    const response = await api.patch(`/user/debts/update-debt/${debtId}`, debtData);
    return response.data;
  } catch (error) {
    console.error(`Error updating debt ${debtId}:`, error);
    throw error;
  }
};

// the backend refuses (400) while the debt still has movements
export const deleteDebt = async (debtId) => {
  try {
    const response = await api.delete(`/user/debts/delete-debt/${debtId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting debt ${debtId}:`, error);
    throw error;
  }
};

// movementData: { movementType, amount, date, accountId, description }
// returns the updated { debt, movements }
export const addDebtMovement = async (debtId, movementData) => {
  try {
    const response = await api.post(`/user/debts/${debtId}/add-movement`, movementData);
    return response.data;
  } catch (error) {
    console.error(`Error adding movement to debt ${debtId}:`, error);
    throw error;
  }
};

export const deleteDebtMovement = async (debtId, movementId) => {
  try {
    const response = await api.delete(`/user/debts/${debtId}/delete-movement/${movementId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting movement ${movementId}:`, error);
    throw error;
  }
};
