
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ;

export const authAxios = axios.create({
  baseURL: API_BASE,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
