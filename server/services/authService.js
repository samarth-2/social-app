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

module.exports = {
  signupService,
  signinService
};
