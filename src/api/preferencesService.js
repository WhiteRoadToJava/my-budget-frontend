import api from "./axios";

// { language, baseCurrency, firstDayOfWeek, defaultAccountId }, null when not chosen.
export const getPreferences = async () => {
  try {
    const response = await api.get("/user/preferences");
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error;
  }
};

// only the fields sent change; "" clears one
export const updatePreferences = async (changes) => {
  try {
    const response = await api.patch("/user/preferences", changes);
    return response.data;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};