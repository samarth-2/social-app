const { Role } = require("../models/role");
const User = require("../models/user");
const { signupService, signinService, followUserService, unfollowUserService, getUsersForChatService ,getRandomUsersService,getActiveUsersService, getUserProfileService } = require("../services/authService");

const signupController = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await signupService({ name, username, email, password });

    return res.status(201).json({
      message: "User registered successfully",
      data:user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ( !email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const {user,token} = await signinService({ email, password });
    res.cookie("token", token, {
      httpOnly: true,          
      sameSite: "strict",      
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
      message: "logged-in successfully",
      data:{user}
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const followUserController = async (req, res) => {
  try {
    const payload={
      currentUserId:req.user.userId,
      targetUserId:req.target_id
    }
    const result = await followUserService(payload);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const unfollowUserController = async (req, res) => {
  try {
    const payload={
      currentUserId:req.user.userId,
      targetUserId:req.target_id
    }
    const result = await unfollowUserService(payload);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getRandomUsersController = async (req, res) => {
  try {
    const result = await getRandomUsersService(req.user.userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getActiveUsersController = async (req, res) => {
  try {
    const result = await getActiveUsersService(req.user.userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const getUserProfileController = async (req, res) => {
  try {
    const { userId } = req.params;
    if(!userId){
      return res.status(400).json({message:"UserId is required"});
    }
    const result = await getUserProfileService(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

 const checkUserAuthController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    let roleName = "user";
    if (user.role) {
      const role = await Role.findById(user.role).select("name").lean();
      if (role) roleName = role.name;
    }

    const userWithRole = { ...user, roleName };

    res.status(200).json({ user: userWithRole });
  } catch (err) {
    console.error("Error checking auth:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const logoutController=async(req,res)=>{
  try{
    res.clearCookie("token",{
      httpOnly: true,          
      sameSite: "strict",      
    });
    return  res.status(200).json({message:"Logged out successfully"});
  }catch(err){
    return res.status(400).json({message:err.message});
  }
}

module.exports = {
    signupController,
    signinController,
    followUserController,
    unfollowUserController,
    getActiveUsersController,
    getRandomUsersController,
    getUserProfileController,
    checkUserAuthController,
    logoutController
}