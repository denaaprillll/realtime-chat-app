function InputArea({
  message,
  setMessage,
  sendMessage,
  setSelectedImage,
  setSelectedFile,
}) {
  return (
    <div className="input-area">

      <input
        type="file"
        accept="image/*"
        id="imageInput"
        style={{ display: "none" }}
        onChange={(e) => {
          setSelectedImage(e.target.files[0]);
        }}
      />

      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => {
          setSelectedFile(e.target.files[0]);
        }}
      />

      <button
        onClick={() =>
          document.getElementById("imageInput").click()
        }
      >
        📷
      </button>

      <button
        onClick={() =>
          document.getElementById("fileInput").click()
        }
      >
        📎
      </button>

      <input
        className="message-input"
        type="text"
        placeholder="Ketik pesan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button
        className="send-button"
        onClick={sendMessage}
      >
        Kirim
      </button>

    </div>
  );
}

export default InputArea;