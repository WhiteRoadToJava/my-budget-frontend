import axios from "axios";

export const addUser = async (userData) => {
  try {
    const response = await axios.post("admin/users/user-register", userData);
    return response;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};