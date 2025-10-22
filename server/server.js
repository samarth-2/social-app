const http = require("http");
const config = require("./config/config");
const { initSocket } = require("./socket/socket");
const { connectDB } = require("./database/database");

const app = require("./app");

if (process.env.NODE_ENV !== "test") {
  const server = http.createServer(app);
  initSocket(server);

  server.listen(config.PORT, () => {
    console.log(`Server running at port ${config.PORT}`);
  });

  connectDB().then((mongoose) => {
    mongoose.connection.once("open", async () => {
      console.log("MongoDB connected — syncing indexes...");

      const { Role } = require("./models/role");
      const { Permission } = require("./models/permission");
      const User = require("./models/user");
      const Post = require("./models/post");
      const Comment = require("./models/comment");

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
  }).catch(err => {
    console.error('Failed to connect to DB from server start:', err);
  });
}
