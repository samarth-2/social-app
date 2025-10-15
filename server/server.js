const express = require("express");
const mongoose = require("./database/database");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const chatRoutes = require("./routes/chatRoutes");
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

const server = http.createServer(app);
initSocket(server);


server.listen(config.PORT, () => {
  console.log(`Server running at port ${config.PORT}`);
});