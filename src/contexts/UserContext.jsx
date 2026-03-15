import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import {useAuth} from "../hooks/useAuth.jsx";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const auth = useAuth();

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

useEffect(() => {
    if (auth.currentUser) {
        setUserProfile(auth.currentUser);
    } else {
        setUserProfile(null);
    }
}, [auth.currentUser]);




const updateUserProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
   try {
    const response = await api.patch("/users/profile", updatedData);
    setUserProfile(response.data);
    if (auth.currentUser) {
    await auth.checkAuthStatus();
    }
    return response.data;
   }catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    setError(error.response?.data || "An error occurred while updating the profile.");
   }finally {
    setLoading(false);
   }
};

    const value = {
        userProfile,
        loading,
        error,
        updateUserProfile,
        setError
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );

}