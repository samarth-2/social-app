import { authAxios } from "./axios";

export const createComment = async (text,postId) => {
  try {
    const payload = { text,postId};
    const response = await authAxios.post("/comment/create", payload);
    return response.data; 
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error.response?.data || { message: "Failed to create comment" };
  }
};
