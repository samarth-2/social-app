import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAxios } from "../../../api/axios";

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const res = await authAxios.get("/admin/users");
  return res.data.data;
});

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/users/create", userData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/users/update", userData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await authAxios.post("/admin/users/delete", { userId });
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.users.findIndex((u) => u._id === updated._id);
        if (index !== -1) state.users[index] = updated;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
