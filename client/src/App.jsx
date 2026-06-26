import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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
    <div style={{ padding: "20px" }}>
      <h1>Realtime Chat App</h1>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "15px",
        }}
      >
        {messages.map((msg, index) => { 
          const isMe = msg.username === username;

  return (
          <div
            key={index}
            style={{
              display:"flex",
              justifyContent:isMe ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
             <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          maxWidth: "300px",
          backgroundColor: isMe ? "#DCF8C6" : "#F1F0F0",
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
  );
}

export default App;