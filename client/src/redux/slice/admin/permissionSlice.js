import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAxios } from "../../../api/axios";

export const fetchPermissions = createAsyncThunk("admin/fetchPermissions", async () => {
  const res = await authAxios.get("/admin/permissions");
  return res.data.data;
});

export const createPermission = createAsyncThunk(
  "admin/createPermission",
  async (permissionData, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/permissions/create", permissionData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updatePermission = createAsyncThunk(
  "admin/updatePermission",
  async (permissionData, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("/admin/permissions/update", permissionData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "admin/deletePermission",
  async (permissionId, { rejectWithValue }) => {
    try {
      await authAxios.post("/admin/permissions/delete", { permissionId });
      return permissionId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const permissionSlice = createSlice({
  name: "adminPermissions",
  initialState: {
    permissions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.permissions.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.permissions[index] = updated;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter((p) => p._id !== action.payload);
      });
  },
});

export default permissionSlice.reducer;
