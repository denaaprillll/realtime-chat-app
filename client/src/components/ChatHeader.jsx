function ChatHeader({ username, selectedUser }) {
  return (
    <div className="chat-header">
      <h2>💬 Hii let's talk</h2>

      <div style={{ marginTop: "8px", fontSize: "14px" }}>
        {selectedUser
          ? selectedUser.username
          : username}
      </div>

      <div className="online-status">
        {selectedUser
          ? selectedUser.online
            ? "🟢 Online"
            : "⚪ Offline"
          : "Online"}
      </div>
    </div>
  );
}

export default ChatHeader;