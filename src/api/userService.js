import api from "./axios";

export const getUser = async () => {
  try {
    const response = await api.get("/user/user-info");
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};