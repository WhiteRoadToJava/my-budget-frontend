import api from "../axios";

export const addUser = async (userData) => {
  try {
    const response = await api.post("/admin/users/user-register", userData);
    return response;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};
// ---------- admins ----------

export const getAdmins = async () => {
  const response = await api.get("/admin/admins");
  return response.data;
};

// request: { email, firstName, lastName, phone, language }
export const inviteAdmin = async (request) => {
  const response = await api.post("/admin/admins/invite", request);
  return response.data;
};

export const resendAdminInvitation = async (adminId, language) => {
  const response = await api.post(`/admin/admins/${adminId}/resend`, null, { params: { language } });
  return response.data;
};



// ---------- currencies ----------

// every currency of the list, the disabled ones too
export const getAdminCurrencies = async () => {
  const response = await api.get("/admin/currencies");
  return response.data;
};

export const addCurrency = async (code) => {
  const response = await api.post("/admin/currencies", { code });
  return response.data;
};

// changes: any of { enabled, payment }
export const updateCurrency = async (code, changes) => {
  const response = await api.patch(`/admin/currencies/${code}`, changes);
  return response.data;
};

// codes: every code of the list, in the new order
export const orderCurrencies = async (codes) => {
  const response = await api.put("/admin/currencies/order", { codes });
  return response.data;
};