const express = require("express");
const mongoose = require("./database/database");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const imageKitRoutes = require("./routes/imageKitRoutes");
const googleAuthRoutes = require("./routes/googleRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const config = require("./config/config");
const { initSocket } = require("./socket/socket");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/chat", chatRoutes);
app.use("/imagekit", imageKitRoutes);
app.use("/google", googleAuthRoutes);
app.use("/admin", adminRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(config.PORT, () => {
  console.log(`Server running at port ${config.PORT}`);
});

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected — syncing indexes...");

  const { Role } = require("./models/role");
  const { Permission } = require("./models/permission");
  const User  = require("./models/user");
  const Post  = require("./models/post");
  const  Comment  = require("./models/comment");

  try {
    await Promise.all([
      Role.syncIndexes(),
      Permission.syncIndexes(),
      User.syncIndexes(),
      Post.syncIndexes(),
      Comment.syncIndexes(),
    ]);
    console.log("All indexes synchronized successfully");
  } catch (err) {
    console.error("Error syncing indexes:", err);
  }
});
