const {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions: getRolePermissions,
} = require("../services/roleService");

const {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require("../services/permissionService");

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/userService");

async function getRoles(req, res) {
  try {
    const roles = await getAllRoles();
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getPermissions(req, res) {
  try {
    const permissions = await getAllPermissions();
    res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createRoleController(req, res) {
  try {
    const role = await createRole(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateRoleController(req, res) {
  try {
    const role = await updateRole(req.body);
    res.status(200).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteRoleController(req, res) {
  try {
    const { roleId } = req.body;
    await deleteRole(roleId);
    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getAllAdminPermissions(req, res) {
  try {
    const permissions = await getAllPermissions();
    res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createPermissionController(req, res) {
  try {
    const permission = await createPermission(req.body);
    res.status(201).json({ success: true, data: permission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updatePermissionController(req, res) {
  try {
    const permission = await updatePermission(req.body._id, req.body);
    res.status(200).json({ success: true, data: permission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deletePermissionController(req, res) {
  try {
    const { permissionId } = req.body;
    await deletePermission(permissionId);
    res.status(200).json({ success: true, message: "Permission deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}


async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createUserController(req, res) {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateUserController(req, res) {
  try {
    const user = await updateUser(req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteUserController(req, res) {
  try {
    const { userId } = req.body;
    await deleteUser(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
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
};
