import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://alumni-connect-portal.onrender.com");

const UserChat = () => {
  const router = useRouter();
  const userId = router.query.userId as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    // Get user ID from local storage or context
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setCurrentUserId(parsed._id);
      socket.emit("join", parsed._id);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId || !userId) return;

    fetch(`https://alumni-connect-portal.onrender.com/api/messages/${currentUserId}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChat(data);
        } else {
          console.error("Invalid data:", data);
          setChat([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setChat([]);
      });

    socket.on("private_message", (data) => {
      if (data.senderId === userId) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("private_message");
    };
  }, [userId, currentUserId]);

  const handleSend = () => {
    if (!message.trim() || !currentUserId || !userId) return;

    const msgData = {
      senderId: currentUserId,
      receiverId: userId,
      message,
    };

    socket.emit("private_message", msgData);
    setChat((prev) => [...prev, { ...msgData, timestamp: new Date() }]);

    fetch("https://alumni-connect-portal.onrender.com/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });

    setMessage("");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-xl font-bold mb-4">Private Chat</h2>
      <div className="bg-gray-800 p-4 rounded h-96 overflow-y-auto mb-4">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.senderId === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <span className="bg-gray-700 px-3 py-1 rounded inline-block">
              {msg.message}
            </span>
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

export default UserChat;
