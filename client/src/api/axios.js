import axios from "axios";
import { store } from "../store";
import { clearAuth } from "../redux/slice/authSlice";

const API_BASE = import.meta.env.VITE_API_URL;

export const authAxios = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      try {
        store.dispatch(clearAuth());
      } catch (e) {
      }
    }
    return Promise.reject(error);
  }
);
