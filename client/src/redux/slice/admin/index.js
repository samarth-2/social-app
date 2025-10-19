import { combineReducers } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";
import permissionReducer from "./permissionSlice";
import userReducer from "./userSlice";
const adminReducer = combineReducers({
  roles: roleReducer,
  permissions: permissionReducer,
  users: userReducer
});

export default adminReducer;
