import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const sendMessage = () => {
  if (message.trim() === "") return;

  // Jangan boleh kirim kalau belum memilih lawan chat
  if (!selectedUser) {
    alert("Pilih pengguna terlebih dahulu.");
    return;
  }

  const data = {
    sender: username,
    receiver: selectedUser.username,
    message,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  socket.emit("send_message", data);
  setMessage("");
};
const getLastMessage = (user) => {
  const userMessages = messages.filter(
    (msg) =>
      msg.sender === user ||
      msg.receiver === user
  );

  if (userMessages.length === 0) return null;

  return userMessages[userMessages.length - 1];
};

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("online_users", (count) => {
    setOnlineUsers(count);
});
socket.on("user_list", (list) => {
  
        setUsers(list);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  if (!joined) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Masuk Chat</h1>

        <input
          type="text"
          placeholder="Masukkan nama..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={() => {
             if (username.trim() !== "") {
    setJoined(true);

    socket.emit("join_user", username);
    
  }
}} >
          Gabung Chat
        </button>
      </div>
    );
  }

  return (

  <div className="app">
  <div className="sidebar">
      <h2>💬 Real Time Chat</h2>

  <input
  className="search-input"
  type="text"
  placeholder="Cari pengguna..." 
  />
   <div className="profile-card">
    <p className="profile-title">
      My Profile ({username})
    </p>

    <div className="profile-avatar">
      {username.charAt(0).toUpperCase()}

  <span className="online-dot"></span>
    </div>

    <p className="profile-subtitle">
      My Account
    </p>

    <h3 className="profile-name">
      {username}
    </h3>

  
  </div>

  {users
  .filter((user) => user.username !== username)
  .map((user, index) => {
    const lastMessage = getLastMessage(user.username);

    return (
      <div key={index} className={`user-card ${
        selectedUser?.username === user.username
            ? "active-user"
            : ""
    }`}
    onClick={() => setSelectedUser(user)}>

        <div className="avatar">
          {user.username.charAt(0).toUpperCase()}

          {user.online && (
            <span className="online-dot"></span>
          )}
        </div>

        <div className="user-info">

          <div className="user-header">

            <span className="user-name">
              {user.username}
            </span>

            <small className="user-time">
              {lastMessage ? lastMessage.time : ""}
            </small>

          </div>

          <div className="last-message">
            {lastMessage
              ? lastMessage.message
              : "Belum ada pesan"}
          </div>

        </div>

      </div>
    );
  })}
    </div>

    {/* Chat Room */}
  <div className="chat-room">
      {/* Header */}
    <div className="chat-header">
        <h2> 💬 Hii let's talk</h2>
        <div style={{ marginTop: "8px", fontSize: "14px",  }}>
          {selectedUser
    ? ` ${selectedUser.username}`
    : ` ${username}`}
        </div>

      <div className="online-status">
          {selectedUser
    ? selectedUser.online
        ? "🟢 Online"
        : "⚪ Offline"
    : "Online"}
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        {messages
        .filter((msg) => {
    if (!selectedUser) return false;

    return (
      (msg.sender === username &&
        msg.receiver === selectedUser.username) ||

      (msg.sender === selectedUser.username &&
        msg.receiver === username)
    );
  })
        
        .map((msg, index) => {
          const isMe = msg.sender === username;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
      <div className={`message ${isMe ? "my-message" : "other-message"}`}>
                <div>
                  <strong>{msg.sender}</strong>

                  <small style={{ marginLeft: "8px" }}>
                    {msg.time}
                  </small>
                </div>

                <div style={{ marginTop: "5px" }}>
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
<div className="input-area">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={message}
          className="message-input"
          onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }} />


        <button
          onClick={sendMessage}
          className="send-button"
        >
          Kirim
        </button>
      </div>
    </div>
  </div>
);
}

export default App;