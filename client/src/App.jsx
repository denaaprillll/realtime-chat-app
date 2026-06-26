import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
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
            }
          }}
        >
          Gabung Chat
        </button>
      </div>
    );
  }

  return (

  <div
    style={{
      display: "flex",
      minHeight: "93vh",
      padding: "20px",
      gap: "20px",
      backgroundColor: "#ffffff",
    }}
  >
    {/* Sidebar */}
    <div
      style={{
        width: "280px",
        backgroundColor: "#e0d5d5",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 2px 8px rgba(216, 169, 169, 0.1)",
      }}
    >
      <h2>💬 Real Time Chat</h2>
      <input
        type="text"
        placeholder="Cari pengguna..."
        style={{
          width: "92%",
          padding: "8px",
          marginTop: "18px",
          marginBottom: "25px",
        }}
      />

      <div
        style={{
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "#f6f6f6",
        }}
      >
         {username}
      </div>
    </div>

    {/* Chat Room */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#e0a8c7",
          color: "white",
          padding: "2px 2px",
          borderRadius: "18px",
          marginBottom: "1px",
        }}
      >
        <h2 style={{ margin: 0 }}>💬 Hii let's talk</h2>

        <div style={{ marginTop: "8px", fontSize: "14px",  }}>
          👤 {username}
        </div>

        <div
          style={{
            color: "#680f56",
            fontSize: "13px",
            marginTop: "3px",
          }}
        >
          Online
        </div>
      </div>

      {/* Chat Box */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #f13580",
          borderRadius: "25px",
          padding: "15px",
          backgroundColor: "#e3bad757",
          marginBottom: "15px",
        }}
      >
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
              <div
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  maxWidth: "300px",
                  backgroundColor: isMe ? "#e7338454" : "#e3b9d3",
                }}
              >
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
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
          }}
        >
          Kirim
        </button>
      </div>
    </div>
  </div>
);
}

export default App;