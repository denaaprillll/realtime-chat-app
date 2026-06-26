import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([
  "Budi",
  "Sinta",
  "Rina",
]);
  const [onlineUsers, setOnlineUsers] = useState(0);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const data = {
      username,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", data);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("online_users", (count) => {
    setOnlineUsers(count);
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

    setUsers((prev) => {
      if (prev.includes(username)) return prev;
      return [...prev, username];
    });
  }
}}
        >
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
      👤
    </div>

    <p className="profile-subtitle">
      My Account
    </p>

    <h3 className="profile-name">
      {username}
    </h3>

    <p className="profile-status">
      🟢 Online
    </p>
  </div>

  {users.map((user, index) => (
  <div key={index} className="user-card">
     {user}
  </div>
  
))}
    </div>

    {/* Chat Room */}
  <div className="chat-room">
      {/* Header */}
    <div className="chat-header">
        <h2 style={{ margin: 0 }}>💬 Hii let's talk</h2>
        <div style={{ marginTop: "8px", fontSize: "14px",  }}>
          👤 {username}
        </div>

      <div className="online-status">
          Online
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        {messages.map((msg, index) => {
          const isMe = msg.username === username;

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
                  <strong>{msg.username}</strong>

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