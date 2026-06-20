import api from "./axios";

export const getUser = async () => {
  try {
    const response = await api.get("/user/user-info");
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.patch("/user/update-user", userData);
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const registeUser = (userData) =>{
  try{
    const response = api.post('/auth/register',
      userData
    )
    return response;
  }catch(err){
    console.error("Error Register user", err)
    throw err
  }
}