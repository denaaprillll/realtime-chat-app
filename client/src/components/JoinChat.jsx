function JoinChat({
  username,
  setUsername,
  setJoined,
  socket,
}) {
  const handleJoin = () => {
    if (username.trim() !== "") {
      setJoined(true);
      socket.emit("join_user", username);
      
    }
  };

  return (
    <div className="join-container">

      <div className="join-card">

        {/* Bagian Judul */}

        <div className="join-header">
          <h1>💬 Real Time Chat</h1>
          <p>
            Aplikasi chat real-time menggunakan
            Socket.IO
          </p>
        </div>

        {/* Isi */}

        <div className="join-content">

          {/* Kiri */}

          <div className="join-left">

            <h2>👋 Selamat Datang</h2>

            <p>
              Nikmati pengalaman chatting secara
              realtime bersama teman Anda.
            </p>

            <ul>

              <li>✔ Chat pribadi</li>

              <li>✔ Kirim gambar</li>

              <li>✔ Kirim file</li>

              <li>✔ Status online</li>

            </ul>

          </div>

          {/* Kanan */}

          <div className="join-right">

            <label>Nama Pengguna</label>

            <input
              type="text"
              placeholder="Masukkan nama Anda"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <button onClick={handleJoin}>
              Masuk ke Chat
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default JoinChat;