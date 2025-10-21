const {socketHandler} = require("../socket/socketHandler");
let io;

function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  socketHandler(io);
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  }
  return io;
}

module.exports = { initSocket, getIO };
