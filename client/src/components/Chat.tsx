import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://alumni-connect-portal.onrender.com");

interface ChatProps {
  currentUserId: string;
  selectedUserId: string;
}

const Chat = ({ currentUserId, selectedUserId }: ChatProps) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    socket.emit("join", currentUserId);

    fetch(`https://alumni-connect-portal.onrender.com/api/messages/${currentUserId}/${selectedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setChat(data);
        else setChat([]);
      });

    socket.on("private_message", (data) => {
      if (data.senderId === selectedUserId) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("private_message");
    };
  }, [selectedUserId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMsg = {
      senderId: currentUserId,
      receiverId: selectedUserId,
      message,
    };

    socket.emit("private_message", newMsg);

    await fetch("https://alumni-connect-portal.onrender.com/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });

    setChat((prev) => [...prev, { ...newMsg, timestamp: new Date() }]);
    setMessage("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md max-w-lg mx-auto">
      <div className="h-64 overflow-y-scroll bg-gray-800 p-3 rounded text-white mb-4">
        {chat.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
            <span className="bg-gray-700 px-3 py-1 rounded inline-block">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
