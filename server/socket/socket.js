const {socketHandler} = require("../socket/socketHandler");
const config = require("../config/config");
let io;

function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
  origin: config.ALLOWED_ORIGINS || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  socketHandler(io);
}

function getIO() {
  if (!io) {
    return { emit: () => {} };
  }
  return io;
}

module.exports = { initSocket, getIO };
