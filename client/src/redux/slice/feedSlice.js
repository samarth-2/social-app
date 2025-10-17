import { createSlice } from "@reduxjs/toolkit";
import { fetchPostsThunk, createPostThunk } from "../asyncthunk/postsThunks";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPostsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.posts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createPostThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); 
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage } = postsSlice.actions;
export default postsSlice.reducer;
