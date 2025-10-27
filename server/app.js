const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const imageKitRoutes = require("./routes/imageKitRoutes");
const googleAuthRoutes = require("./routes/googleRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { initSocket } = require("./socket/socket");
const config = require("./config/config");
const sanitizeMiddleware = require("./utils/sanitizeMiddleware");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cors({ origin: config.ALLOWED_ORIGINS ,credentials: true }));
app.use(cookieParser());
app.use(sanitizeMiddleware)

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/chat", chatRoutes);
app.use("/imagekit", imageKitRoutes);
app.use("/google", googleAuthRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
