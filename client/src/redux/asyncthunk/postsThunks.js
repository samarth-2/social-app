import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFeed, createPost } from "../../api/post";
import imagekit from "../../api/imagekit";

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
      const authResponse = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT);
      if (!authResponse.ok) throw new Error("Failed to get ImageKit auth");
      const authData = await authResponse.json();


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
