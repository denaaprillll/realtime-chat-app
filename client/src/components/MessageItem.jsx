function MessageItem({ msg, username }) {
  const isMe = msg.sender === username;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        className={`message ${
          isMe ? "my-message" : "other-message"
        }`}
      >
        <div>
          <strong>{msg.sender}</strong>

          <small style={{ marginLeft: "8px" }}>
            {msg.time}
          </small>
        </div>

        <div style={{ marginTop: "5px" }}>
          {msg.message && (
            <div>{msg.message}</div>
          )}

          {msg.image && (
            <img
              src={`http://localhost:3000${msg.image}`}
              alt="gambar"
              style={{
                width: "200px",
                borderRadius: "10px",
                marginTop: "5px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageItem;