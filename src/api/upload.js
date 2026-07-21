import axios from "axios";
import api from "./axios";

export const imagesUpload = async (request) => {
  try {
    const response = await api.post(`/user/upload/upload-image`, request,{
        headers: {
        'Content-Type': undefined,
        }
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error to upload images: ", error);
    throw error;
  }
};
