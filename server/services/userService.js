const User = require("../models/user");
const Role = require("../models/role");

async function getAllUsers() {
  const users = await User.find()
    .populate("role", "name")
    .lean();
  return users;
}

async function createUser(data) {
  const { name, username, email, password, role } = data;
  const user = await User.create({ name, username, email, password, role });
  return await User.findById(user._id).populate("role").lean();
}

async function updateUser(data) {
  const { _id, name, username, email, role } = data;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { name, username, email, role },
    { new: true }
  )
    .populate("role")
    .lean();
  return updatedUser;
}

async function deleteUser(userId) {
  return await User.findByIdAndDelete(userId);
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
