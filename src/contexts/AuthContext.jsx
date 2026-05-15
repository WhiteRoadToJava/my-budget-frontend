import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State to hold the current authenticated user, null if not authenticated
  // lagra autenticated user data i state, null om ingen är inloggad
  const [currentUser, setCurrentUser] = useState(null);

  // State to track loading status of authentication check, holla koll på loading state medans vi kollar auth satus.
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get("/auth/check",{
        withCredentials: true
      });
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
    } finally { 
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

const login = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    
    // تأكد أن السيرفر يرسل التوكن في حقل jwtToken (أو الاسم الذي اخترته في AuthResponse)
    const token = response.data.jwtToken; 
    
    if (token && token !== "Login successful") {
      localStorage.setItem('token', token); // تخزين التوكن الحقيقي
      setCurrentUser(response.data);
      return response.data;
    } else {
      console.error("The server sent a success message but no real JWT token!");
    }
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

  const register = async (registerData) => {
    try {
      const resonse = await api.post("/auth/register", registerData, {
        withCredentials: true,
      });
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
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};