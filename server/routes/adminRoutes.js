const authMiddleware = require("../utils/authmiddleware");
const express = require("express");
const router = express.Router();
const {
  getRoles,
  getPermissions,
  createRoleController,
  updateRoleController,
  deleteRoleController,
  getAllAdminPermissions,
  createPermissionController,
  updatePermissionController,
  deletePermissionController,
  getUsers,
  createUserController,
  updateUserController,
  deleteUserController,
} = require("../controllers/adminController");

router.use(authMiddleware);

router.get("/roles", getRoles);
router.post("/roles/create", createRoleController);
router.post("/roles/update", updateRoleController);
router.post("/roles/delete", deleteRoleController);

router.get("/permissions", getAllAdminPermissions);
router.post("/permissions/create", createPermissionController);
router.post("/permissions/update", updatePermissionController);
router.post("/permissions/delete", deletePermissionController);

router.get("/users", getUsers);
router.post("/users/create", createUserController);
router.post("/users/update", updateUserController);
router.post("/users/delete", deleteUserController);


module.exports = router;
