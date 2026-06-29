import ChatHeader from "./ChatHeader";
import MessageItem from "./MessageItem";
import InputArea from "./InputArea";
function ChatRoom({
  username,
  selectedUser,
  messages,
  setMessage,
  message,
  sendMessage,
  setSelectedImage,
  setSelectedFile,
  InputArea,
}) {
  return (
    <div className="chat-room">
     <ChatHeader
         username={username}
         selectedUser={selectedUser}
/>

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
    .map((msg, index) => (
      <MessageItem
        key={index}
        msg={msg}
        username={username}
      />
    ))}
</div>

<InputArea
  message={message}
  setMessage={setMessage}
  sendMessage={sendMessage}
  setSelectedImage={setSelectedImage}
  setSelectedFile={setSelectedFile}
/>
    </div>
  );
}

export default ChatRoom;