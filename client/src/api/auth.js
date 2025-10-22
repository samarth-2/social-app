import axios from "axios";
import { socket } from "../utils/socket";
import { authAxios } from "./axios";
const API_BASE = import.meta.env.VITE_API_URL;
export const signup = async (data) => {
    const payload={
        name:data.name,
        username:data.username,
        email:data.email,
        password:data.password
    }
  const res = await axios.post(`${API_BASE}/user/signup`, payload);
  return res.data;
};


export const signin = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/user/signin`, formData);
    const { token, user } = res.data.data;

    if (token) {
      socket.connect();
      socket.emit("register_user", user._id);
    }
    return res.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || "Signin failed");
    } else {
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await authAxios.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};