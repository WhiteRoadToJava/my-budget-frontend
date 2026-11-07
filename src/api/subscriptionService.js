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
