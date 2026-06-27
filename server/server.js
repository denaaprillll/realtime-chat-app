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

// Menyimpan daftar username yang sedang online
let users = [];

// Menyimpan jumlah user online
let onlineUsers = 0;

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // User bergabung ke chat
  socket.on("join_user", (username) => {
    // Simpan username pada socket
    socket.username = username;

    // Hindari username ganda
    if (!users.includes(username)) {
      users.push(username);
    }
    console.log("Daftar user:", users);
    // Kirim daftar user ke semua client
    io.emit("user_list", users);
  });

  // Hitung user online
  onlineUsers++;
  io.emit("online_users", onlineUsers);

  // Kirim pesan
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // Saat user keluar
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    // Hapus username dari daftar user
    users = users.filter((user) => user !== socket.username);

    // Update daftar user ke semua client
    io.emit("user_list", users);

    // Kurangi jumlah user online
    onlineUsers--;
    io.emit("online_users", onlineUsers);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});