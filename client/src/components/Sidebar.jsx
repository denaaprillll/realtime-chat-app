function Sidebar({
  username,
  conversations,
  selectedUser,
  setSelectedUser,
  socket,
}) {
  return (
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

      {conversations.map((chat, index) => {

    const otherUser =
        chat.sender === username
            ? chat.receiver
            : chat.sender;
     const lastMessage = chat;

    return (
            <div
              key={index}
              className={`user-card ${
                selectedUser?.username === otherUser
                  ? "active-user"
                  : ""
              }`}
              onClick={() => {

                setSelectedUser({
                    username: otherUser,
                    online: false,
                });

                socket.emit("load_messages", {
                    sender: username,
                    receiver: otherUser,
                });

                socket.emit("read_messages", {
                    sender: username,
                    receiver: otherUser,
                });

            }}
        >
              <div className="avatar">
                {otherUser.charAt(0).toUpperCase()}
                
              </div>

              <div className="user-info">
                <div className="user-header">
                  <span className="user-name">
                    {otherUser}
                  </span>

                  <small className="user-time">
                    {lastMessage
                      ? lastMessage.time
                      : ""}
                  </small>
                </div>

                <div className="last-message">
  {lastMessage ? (
    <>
      {lastMessage.message}

      {lastMessage.sender === username && (
        <span className="check">
          {lastMessage.status === "sent" && "✓"}

          {lastMessage.status === "delivered" &&
            "✓✓"}

          {lastMessage.status === "read" &&
            "✓✓"}
        </span>
      )}
    </>
  ) : (
    "Belum ada pesan"
  )}
</div>

              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Sidebar;