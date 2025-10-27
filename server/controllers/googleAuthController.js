const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {Role} = require("../models/role");
const config = require("../config/config");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginController = async (req, res) => {
  try {
    const { credential } = req.body; 

    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing credential" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name,googleId: googleId } = payload;

    let user = await User.findOne({ email });


    if (!user) {
      let baseUsername = name
        .toLowerCase()
        .replace(/\s+/g, "") 
        .replace(/[^a-z0-9]/g, "");

      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter++}`;
      }

      user = await User.create({
        name,
        email,
        username,
        googleId: googleId,
        password: null, 
      });
    }

    const token = jwt.sign(
    { userId: user._id, email: user.email,username:user.username },
    config.JWT_SECRET,
    { expiresIn: "1d" }
    );
    let roleName = "user";
    if (user.role) {
      const roleDoc = await Role.findById(user.role).select("name").lean();
      if (roleDoc && roleDoc.name) {
        roleName = roleDoc.name;
      }
    }
    const userObj = user.toObject();
    userObj.roleName = roleName;
    delete userObj.password;

    res.cookie("token", token, {
      httpOnly: true,           
      sameSite: "strict",       
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "logged-in successfully",
      data:{ user: userObj }
    });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};


module.exports={
    googleLoginController
}