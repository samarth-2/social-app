const { Permission } = require("../models/permission");

async function getAllPermissions() {
  return await Permission.find().lean();
}

async function createPermission(data) {
  return await Permission.create(data);
}

async function updatePermission(id, data) {
  return await Permission.findByIdAndUpdate(id, data, { new: true }).lean();
}

async function deletePermission(id) {
  return await Permission.findByIdAndDelete(id);
}

module.exports = {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
};
