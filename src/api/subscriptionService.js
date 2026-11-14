import api from "./axios";

// ---------- the signed-in user ----------

export const getMySubscription = async () => {
  const response = await api.get("/user/subscription");
  return response.data;
};

// ---------- admin ----------

// filter: TRIAL, ACTIVE, EXPIRING, EXPIRED, NOT_SET or empty
export const searchUsers = async ({ q = "", filter = "", page = 0, size = 20 }) => {
  const response = await api.get("/admin/users/search", {
    params: { q: q || undefined, filter: filter || undefined, page, size },
  });
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get("/admin/users/stats");
  return response.data;
};

export const getUserSubscription = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/subscription`);
  return response.data;
};

// request: { months | until, amount, currency, method, reference, note }
export const extendSubscription = async (userId, request) => {
  const response = await api.post(`/admin/users/${userId}/subscription/extend`, request);
  return response.data;
};

export const setUserEnabled = async (userId, enabled) => {
  const response = await api.patch(`/admin/users/${userId}/enabled`, { enabled });
  return response.data;
};

// ---------- payment requests ("I have paid") ----------

// request: { months, method, amount, currency, reference, note }
export const createPaymentRequest = async (request) => {
  const response = await api.post("/user/subscription/payment-requests", request);
  return response.data;
};

export const getMyPaymentRequests = async () => {
  const response = await api.get("/user/subscription/payment-requests");
  return response.data;
};

export const getPendingPaymentRequests = async () => {
  const response = await api.get("/admin/payment-requests");
  return response.data;
};

// decision (optional): { months } or { until }, and adminNote
export const approvePaymentRequest = async (requestId, decision = {}) => {
  const response = await api.post(`/admin/payment-requests/${requestId}/approve`, decision);
  return response.data;
};

// decision: { adminNote } = the reason the user will see
export const rejectPaymentRequest = async (requestId, adminNote) => {
  const response = await api.post(`/admin/payment-requests/${requestId}/reject`, { adminNote });
  return response.data;
};

// deletes the user and all their data; confirmEmail must be the user's email
export const deleteUser = async (userId, confirmEmail) => {
  const response = await api.delete(`/admin/users/${userId}`, { data: { confirmEmail } });
  return response.data;
};
