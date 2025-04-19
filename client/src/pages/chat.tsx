import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://alumni-connect-portal.onrender.com");

const ChatWithUser = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setCurrentUserId(storedUserId);

    if (!storedUserId || !userId) return;

    // Join socket room
    socket.emit("join", storedUserId);

    // Fetch message history
    fetch(`https://alumni-connect-portal.onrender.com/api/messages/${storedUserId}/${userId}`)
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

    // Listen for new messages
    socket.on("private_message", (data) => {
      if (data.senderId === userId || data.receiverId === userId) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("private_message");
    };
  }, [userId]);

  const handleSend = () => {
    if (!message.trim() || !currentUserId || !userId) return;

    const newMsg = {
      senderId: currentUserId,
      receiverId: userId,
      message,
    };

    socket.emit("private_message", newMsg);

    fetch("https://alumni-connect-portal.onrender.com/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });

    setChat((prev) => [...prev, { ...newMsg, timestamp: new Date() }]);
    setMessage("");
  };

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md max-w-lg mx-auto mt-5">
      <h2 className="text-lg font-bold mb-2 text-white">Private Chat</h2>

      <div className="h-64 overflow-y-scroll bg-gray-800 p-2 rounded text-white">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}
          >
            <span className="bg-gray-700 px-3 py-1 rounded inline-block">
              {msg.message}
            </span>
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

export default ChatWithUser;
