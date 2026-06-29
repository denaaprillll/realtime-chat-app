import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import {
  uploadImage,
  uploadFile,} from "./services/uploadService";
import InputArea from "./components/InputArea";
import Sidebar from "./components/Sidebar";
import ChatRoom from "./components/ChatRoom";
import JoinChat from "./components/JoinChat";

const socket = io("http://192.168.100.247:3000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  
 
 
  const sendMessage = async () => {
  console.log("sendMessage jalan");

  if (
    message.trim() === "" &&
    !selectedImage &&
    !selectedFile
  ) {
    return;
  }

  // Jangan boleh kirim kalau belum memilih lawan chat
  if (!selectedUser) {
    alert("Pilih pengguna terlebih dahulu.");
    return;
  }
  const imagePath = await uploadImage(selectedImage);
  const fileResult = await uploadFile(selectedFile);
  
  const data = {
    sender: username,
    receiver: selectedUser.username,
    message,
    image: imagePath,
    file: fileResult ? fileResult.file : null,
    fileName: fileResult ? fileResult.originalName : null,
    status: "sent",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
  console.log(data);
  socket.emit("send_message", data); 
  socket.emit("load_conversations", username);
  setMessage("");
  setSelectedImage(null);
  setSelectedFile(null);
};
const getLastMessage = (user) => {
  const userMessages = messages.filter(
    (msg) =>
      (msg.sender === username &&
        msg.receiver === user) ||
      (msg.sender === user &&
        msg.receiver === username)
  );

  if (userMessages.length === 0) {
    return null;
  }

  return userMessages[userMessages.length - 1];
};
const conversationList = () => {

    const map = {};

    conversations.forEach((msg) => {

        const otherUser =
            msg.sender === username
                ? msg.receiver
                : msg.sender;

        if (!map[otherUser]) {
            map[otherUser] = msg;
        }

    });

    return Object.values(map);

};
 useEffect(() => {
  socket.on("receive_message", (data) => {
    console.log("RECEIVE MESSAGE", data);
    setMessages((prev) => [...prev, data]);
    
  });

  socket.on("online_users", (count) => {
    setOnlineUsers(count);
  });

  socket.on("user_list", (list) => {
    setUsers(list);
  });

  socket.on("chat_history", (history) => {
    console.log("CHAT HISTORY", history);
    setMessages(history);
  });
  socket.on("conversation_list", (data) => {
    console.log("CONVERSATION LIST");
    console.log(data);
    setConversations(data);
});

  return () => {
    socket.off("receive_message");
    socket.off("online_users");
    socket.off("user_list");
    socket.off("chat_history");
    socket.off("conversation_list");
  };
}, []);
  useEffect(() => {

  if (joined && username) {
    socket.emit("load_conversations", username);
  }

}, [joined, username]);


if (!joined) {
  return (
    <JoinChat
      username={username}
      setUsername={setUsername}
      setJoined={setJoined}
      socket={socket}
    />
  );
}

  return (

  <div className="app">
  <Sidebar
      username={username}
    conversations={conversationList()}
    selectedUser={selectedUser}
    setSelectedUser={setSelectedUser}
    socket={socket}
/>
   <ChatRoom
  username={username}
  selectedUser={selectedUser}
  messages={messages}
  message={message}
  setMessage={setMessage}
  sendMessage={sendMessage}
  setSelectedImage={setSelectedImage}
  setSelectedFile={setSelectedFile}
  InputArea={InputArea}
/>
    </div>
 
);
}

export default App;