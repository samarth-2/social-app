import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./redux/slice/feedSlice";
import adminReducer from "./redux/slice/admin";
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    admin: adminReducer,
  },
});
