const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
let onlineUsers = 0;
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  onlineUsers++;
  io.emit("online_users", onlineUsers);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
    onlineUsers--;
    io.emit("online_users", onlineUsers);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});