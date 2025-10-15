import { authAxios } from "./axios";

export const createPost = async (title, content) => {
  try {
    const payload = { title, content };
    const response = await authAxios.post("/post/create-post", payload);
    return response.data; 
  } catch (error) {
    console.error("Error creating post:", error);
    throw error.response?.data || { message: "Failed to create post" };
  }
};
