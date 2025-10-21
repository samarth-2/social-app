import { authAxios } from "./axios";

export const getRandomUsers = async () => {
  try {
    const response = await authAxios.get("/user/random");
    return response;
  } catch (error) {
    console.error("Error fetching random users:", error);
    throw error.response?.data || { message: "Failed to fetch random users" };
  }
};

export const getActiveUsers = async () => {
  try {
    const response = await authAxios.get("/user/active");
    return response;
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error.response?.data || { message: "Failed to fetch active users" };
  }
};
