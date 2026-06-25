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

      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Ketik pesan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Kirim
      </button>
    </div>
  );
}

export default App;