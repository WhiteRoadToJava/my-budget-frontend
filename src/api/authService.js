import api from "./axios";
export const updatePassword = async (requestBody) => {
  try {
    const response = await api.post("/auth/update-password", requestBody);
    return response;
  } catch (error) {
    console.log("Update password error:", error);
  }
};
