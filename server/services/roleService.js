const { Role } = require("../models/role");
const { Permission } = require("../models/permission");

async function getAllRoles() {
  return await Role.find().populate("permissions").lean();
}

async function getAllPermissions() {
  return await Permission.find().lean();
}

async function createRole(data) {
  const { name, permission_level, permissions } = data;
  const newRole = new Role({ name, permission_level, permissions });
  await newRole.save();
  return await Role.findById(newRole._id).populate("permissions").lean();
}

async function updateRole(data) {
  const { _id, name, permission_level, permissions } = data;
  console.log(data);
  const role = await Role.findByIdAndUpdate(
    _id,
    { name, permission_level, permissions },
    { new: true }
  )
    .populate("permissions")
    .lean();
  console.log(role);
  return role;
}

async function deleteRole(roleId) {
  await Role.findByIdAndDelete(roleId);
  return { success: true };
}

module.exports = {
  getAllRoles,
  getAllPermissions,
  createRole,
  updateRole,
  deleteRole,
};
