import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send_message", message);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Realtime Chat App</h1>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
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