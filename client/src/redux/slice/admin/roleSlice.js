import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAxios } from "../../../api/axios";

export const fetchRoles = createAsyncThunk("admin/fetchRoles", async () => {
  const res = await authAxios.get("/admin/roles");
  return res.data.data;
});

export const fetchPermissions = createAsyncThunk("admin/fetchPermissions", async () => {
  const res = await authAxios.get("/admin/permissions");
  return res.data.data;
});

export const createRole = createAsyncThunk(
  "admin/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/roles/create", roleData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "admin/updateRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/roles/update", roleData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "admin/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/roles/delete", { roleId });
      return roleId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const roleSlice = createSlice({
  name: "adminRoles",
  initialState: {
    roles: [],
    permissions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.roles.findIndex((r) => r._id === updated._id);
        if (index !== -1) state.roles[index] = updated;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r._id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
