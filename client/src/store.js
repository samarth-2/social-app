import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./redux/slice/feedSlice";
import adminReducer from "./redux/slice/admin";
import authReducer from "./redux/slice/authSlice";
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    admin: adminReducer,
    auth:authReducer
  },
});
