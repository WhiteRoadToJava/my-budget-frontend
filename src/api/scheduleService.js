import api from "./axios";

export const addSchedule = async (scheduleData) => {
  try {
    const response = await api.post("/user/schedules/excute", scheduleData);
    return response.data;
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId) => {
  try{
  const response = await api.delete(`/user/schedules/delete-schedule/${scheduleId}`);
  return response.data;
  }catch(error){
    console.error(`Error deleting schedule with ID ${scheduleId}:`, error);
    throw error;
  }
};

export const getAllSchedule = async () => {
  try {
    const response = await api.get("/user/schedules/all-schedules");
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};