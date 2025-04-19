import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://alumni-connect-portal.onrender.com");

const Chat = ({ currentUserId, selectedUserId }: any) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    socket.emit("join", currentUserId);

    // Fetch past messages
    fetch(`https://alumni-connect-portal.onrender.com/api/messages/${currentUserId}/${selectedUserId}`)
      .then(res => res.json())
      .then(data => setChat(data));

    socket.on("private_message", (data) => {
      if (data.senderId === selectedUserId) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("private_message");
    };
  }, [selectedUserId]);

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("private_message", {
      senderId: currentUserId,
      receiverId: selectedUserId,
      message
    });

    setChat((prev) => [...prev, {
      senderId: currentUserId,
      receiverId: selectedUserId,
      message,
      timestamp: new Date()
    }]);

    // Save to DB
    fetch("https://alumni-connect-portal.onrender.com/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: currentUserId, receiverId: selectedUserId, message })
    });

    setMessage("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-2 text-white">Chat</h2>
      <div className="h-64 overflow-y-scroll bg-gray-800 p-2 rounded text-white">
        {chat.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
            <span className="bg-gray-700 px-3 py-1 rounded inline-block">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-600 px-4 py-2 rounded text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
