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
