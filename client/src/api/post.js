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

export const fetchFeed = async (page = 1, limit = 5) => {
  try {
    const response = await authAxios.get(`/post/feed?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error.response?.data || { message: "Failed to fetch posts" };
  }
};
