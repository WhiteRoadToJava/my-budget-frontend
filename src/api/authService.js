import api from "./axios";
// errors are thrown to the page, which shows the server's message
export const updatePassword = async (requestBody) => {
  const response = await api.post("/auth/update-password", requestBody);
  return response;
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


export const forgotPassword = async (username, language) =>{
  const response = await api.post("/auth/forgot-password", {
    username,
    language,
  });
  return response.data;
}

// Saves the new password chosen from the emailed link (reset or admin invitation).
// It must call /auth/reset-password and wait for the answer: calling
// /auth/forgot-password only sent another email, and without await every
// attempt looked successful while nothing was saved.
export const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });
  return response.data;
};