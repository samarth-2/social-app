import axios from "axios";
import { socket } from "../utils/socket";
const API_BASE = import.meta.env.VITE_API_URL;
export const signup = async (data) => {
    const payload={
        name:data.name,
        username:data.username,
        email:data.email,
        password:data.password
    }
  const res = await axios.post(`${API_BASE}/user/signup`, payload);
  console.log(res);
  return res.data;
};


export const signin = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/user/signin`, formData);
    const { token, user } = res.data.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    socket.connect();
    socket.emit("register_user", user._id);
    return res.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || "Signin failed");
    } else {
      throw new Error("Network error. Please try again later.");
    }
  }
};