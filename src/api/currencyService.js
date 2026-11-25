import api from "./axios";

// the app's currencies, in the admin's order: [{ code, enabled, payment, position }]
// enabled: for accounts, debts and the base currency; payment: for subscription payments
export const getCurrencies = async () => {
  const response = await api.get("/currencies");
  return response.data;
};