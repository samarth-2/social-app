const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");
const Role = require("../models/role");
const Permission = require("../models/permission");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.userId).populate({
      path: "role",
      populate: { path: "permissions" },
    });

    if (!user || !user.role) {
      return res.status(403).json({ message: "User role not assigned or invalid" });
    }

    const role = user.role;
    const method = req.method.toUpperCase();
    const route = req.originalUrl.split("?")[0];
    if (route.includes("/admin")) {
      if (role.name !== "admin") {
        return res.status(403).json({ message: "Access denied: admin only route" });
      }
    }

    if (role.permission_level === "*") {
      req.user = decoded;
      return next();
    }

    

    const allowed = role.permissions.some((perm) =>
      perm.routes.some(
        (r) =>
          r.method.toUpperCase() === method &&
          r.path.replace(/\/$/, "") === route.replace(/\/$/, "")
      )
    );

    if (!allowed) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
