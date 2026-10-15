import api from "./axios";
export const updatePassword = async (requestBody) => {
  try {
    const response = await api.post("/auth/update-password", requestBody);
    return response;
  } catch (error) {
    console.error("Update password error:", error);
  }
};

export const activateAccount = async (token) => {
  const response = await api.post("/auth/activate", { token });
  return response.data;
};

export const resendActivation = async(username, language) => {
  const response = await api.post("/auth/resend-activation",{
    username,
    language,
  });
  return response.data;
}
