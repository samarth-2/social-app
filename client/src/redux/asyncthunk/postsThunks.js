import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFeed, createPost } from "../../api/post";
import imagekit from "../../api/imagekit";
import { authAxios } from "../../api/axios";
export const fetchPostsThunk = createAsyncThunk(
  "posts/fetchPosts",
  async (page, { rejectWithValue }) => {
    try {
      const data = await fetchFeed(page);
      if (!data.success) throw new Error("Failed to load posts");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPostThunk = createAsyncThunk(
  "posts/createPost",
  async ({ title, content, imageFile }, { rejectWithValue }) => {
    try {
      const authResponse = await authAxios.get("/imagekit/auth");
      const authData = authResponse.data;
      if (!authData?.token || !authData?.signature) {
        throw new Error("Invalid ImageKit auth response");
      }
      const uploadResponse = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: imageFile,
            fileName: `post_${Date.now()}.jpg`,
            folder: "/posts",
            token: authData.token,
            signature: authData.signature,
            expire: authData.expire,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      const imageUrl = uploadResponse.url;
      const post = await createPost(title, content, imageUrl);
      return post;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
