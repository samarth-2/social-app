import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./redux/slice/feedSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});
