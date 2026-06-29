const db = require("./db");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*"
}));
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

const upload = multer({
  storage: storage,
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const uploadFile = multer({
  storage: fileStorage,
});
app.use("/uploads", express.static("uploads"));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 
    ["http://localhost:5173",
      "http://192.168.100.247:5173",],
    methods: ["GET", "POST"],
  },
});

app.post("/upload", upload.single("image"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: "Tidak ada gambar."
    });
  }

  res.json({
    image: `/uploads/${req.file.filename}`
  });

});
app.post(
  "/upload-file",
  uploadFile.single("file"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "Tidak ada file.",
      });
    }

    res.json({
      file: `/uploads/files/${req.file.filename}`,
      originalName: req.file.originalname,
    });

  }
);
let users = [];

// Menyimpan jumlah user online
let onlineUsers = 0;

io.on("connection", (socket) => {


  console.log("User Connected:", socket.id);
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

  const sql = `
    INSERT INTO messages
    (sender, receiver, message, image,file, fileName, time, status)
    VALUES (?, ?, ?, ?, ?, ? , ?, ?)
  `;

  db.query(
    sql,
    [
      data.sender,
      data.receiver,
      data.message,
      data.image,
      data.file,
      data.fileName,
      data.time,
      "sent"
    ],
    (err) => {

      if (err) {
        console.error(err);
        return;
      }

      const receiver = users.find(
        (user) => user.username === data.receiver
      );

      if (receiver) {
        io.to(receiver.socketId).emit(
          "receive_message",
          data
        );
      }

      socket.emit( "receive_message",data);
      db.query(
  `
  SELECT *
  FROM messages
  WHERE sender=? OR receiver=?
  ORDER BY id DESC
  `,
  [data.sender, data.sender],
  (err, result) => {
    if (!err) {
      socket.emit("conversation_list", result);
    }
  }
);

    }
  );

});


socket.on("load_messages", (data) => {

db.query(
  `UPDATE messages
   SET status='delivered'
   WHERE sender=? AND receiver=? AND status='sent'`,
  [data.receiver, data.sender]
);
  const sql = `
    SELECT *
    FROM messages
    WHERE
      (sender = ? AND receiver = ?)
      OR
      (sender = ? AND receiver = ?)
    ORDER BY id ASC
  `;

  db.query(
    sql,
    [
      data.sender,
      data.receiver,
      data.receiver,
      data.sender,
    ],
    (err, result) => {

      if (err) {
        console.log("Gagal mengambil chat:", err);
        return;
      }

      socket.emit("chat_history", result);

    }
  );

});
socket.on("load_conversations", (username) => {
console.log("LOAD :", username);

    const sql = `
        SELECT *
        FROM messages
        WHERE sender = ?
        OR receiver = ?
        ORDER BY id DESC
    `;

    db.query(sql, [username, username], (err, result) => {

        if (err) {
            console.log(err);
            return;
        }

        console.log("HASIL QUERY");
        console.log(result);

        socket.emit("conversation_list", result);

    });

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