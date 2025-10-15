const { signupService, signinService, followUserService, unfollowUserService } = require("../services/authService");

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

    const user = await signinService({ email, password });

    return res.status(200).json({
      message: "logged-in successfully",
      data:user,
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


module.exports = {
    signupController,
    signinController,
    followUserController,
    unfollowUserController
}