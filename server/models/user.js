const mongoose = require("../database/database");
const { Role } = require("./role");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9_]{3,20}$/, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }
  },
  {
    timestamps: true,
  }
);
userSchema.index({ role: 1 });

userSchema.pre("save", async function (next) {
  if (!this.role) {
    const defaultRole = await Role.findOne({ name: "user" });
    if (defaultRole) {
      this.role = defaultRole._id;
    } else {
      console.warn("Default role 'User' not found. Please seed roles first.");
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
