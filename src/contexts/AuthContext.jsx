import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State to hold the current authenticated user, null if not authenticated
  // lagra autenticated user data i state, null om ingen är inloggad
  const [currentUser, setCurrentUser] = useState(null);

  // State to track loading status of authentication check, holla koll på loading state medans vi kollar auth satus.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/auth/check",{
        withCredentials: true
      });
      setCurrentUser(response.data);
      console.log("Auth status checked:", response.data);
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally { 
      setLoading(false);
    }
  };

  const login = async (loginDData) => {
    try {
      const response = await api.post("/auth/login", loginDData);
      setCurrentUser(response.data);
      console.log("Response from login:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message,
      );
    }
  };

  const register = async (registerData) => {
    try {
      const resonse = await api.post("/auth/register", registerData);
      setCurrentUser(resonse.data);
      console.log("Response from register:", resonse.data);
      return resonse.data;
    } catch (error) {
      console.error(
        "Error during register:",
        error.response?.data || error.message,
      );
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setCurrentUser(null);
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response?.data || error.message,
      );
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
