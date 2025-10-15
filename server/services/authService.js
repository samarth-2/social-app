const bcrypt = require("bcryptjs");
const User = require("../models/user");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const signupService = async ({ name, username, email, password }) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("Email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};


const signinService = async ({ email, password }) => {
  const user = await User.findOne({email});
  if(!user){
    throw new Error("User does not exist");
  } 
  const match = await bcrypt.compare(password,user.password);
  if(!match){
    throw new Error("email or password do not match");
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email,username:user.username },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token:token };

};


const followUserService = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) throw new Error("User not found");

  if (currentUser.following.includes(targetUserId)) {
    throw new Error("Already following this user");
  }

  currentUser.following.push(targetUserId);
  targetUser.followers.push(currentUserId);

  await currentUser.save();
  await targetUser.save();

  return { message: "Followed successfully" };
};

const unfollowUserService = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot unfollow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) throw new Error("User not found");

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId.toString()
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await targetUser.save();

  return { message: "Unfollowed successfully" };
};

const getFollowedUserService = async (userId) => {
  const user = await User.findById(userId).populate("following", "name username email");
  return user?.following || [];
};

const getUnfollowedUser = async (userId) => {
  const user = await User.findById(userId).select("following");
  const followedIds = user?.following || [];

  const unfollowed = await User.find({
    _id: { $nin: [...followedIds, userId] },
  }).select("name username email");

  return unfollowed;
};
const getUsersForChatService=async(userId)=>{
  const users = await User.find({ _id: { $ne: userId } }).select("name username email");
  return users;
}


module.exports = {
  signupService,
  signinService,
  followUserService,
  unfollowUserService,
  getUsersForChatService
};
