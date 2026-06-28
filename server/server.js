const db = require("./db");
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

// Menyimpan daftar user yang sedang online
let users = [];

// Menyimpan jumlah user online
let onlineUsers = 0;

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // ==========================
  // USER LOGIN
  // ==========================
  socket.on("join_user", (username) => {

    socket.username = username;

    const existingUser = users.find(
      (user) => user.username === username
    );

    if (!existingUser) {

      users.push({
        username: username,
        socketId: socket.id,
        online: true,
      });

    } else {

      existingUser.socketId = socket.id;
      existingUser.online = true;

    }

    console.log("Daftar User:", users);

    io.emit("user_list", users);

  });

  // JUMLAH USER ONLINE

  onlineUsers++;
  io.emit("online_users", onlineUsers);

  // CHAT GLOBAL

  socket.on("send_message", (data) => {
      const receiver = users.find(
    (user) => user.username === data.receiver
  );

  // kirim ke penerima
  if (receiver) {
    io.to(receiver.socketId).emit(
      "receive_message",
      data
    );
  }

  // kirim juga ke pengirim
  socket.emit(
    "receive_message",
    data
  );

});

  // USER KELUAR
 
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    users = users.filter(
      (user) => user.socketId !== socket.id
    );

    
    io.emit("user_list", users);


    onlineUsers--;
    if (onlineUsers < 0) {onlineUsers = 0;}
    io.emit("online_users", onlineUsers); });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});