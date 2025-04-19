import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://alumni-connect-portal.onrender.com");

const ChatWithUser = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [chat, setChat] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setCurrentUserId(storedId);

    if (!storedId || typeof userId !== "string") return;

    socket.emit("join", storedId);

    fetch(`https://alumni-connect-portal.onrender.com/api/messages/${storedId}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChat(data);
        } else {
          console.warn("Expected an array but got:", data);
          setChat([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setChat([]);
        setLoading(false);
      });

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
    if (!message.trim() || !currentUserId || typeof userId !== "string") return;

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

  if (!currentUserId || typeof userId !== "string") {
    return (
      <div className="text-center text-white mt-10">
        🔄 Initializing chat...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-white mt-10">
        📡 Loading messages...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md max-w-lg mx-auto mt-5">
      <h2 className="text-lg font-bold mb-2 text-white">Private Chat</h2>

      <div className="h-64 overflow-y-scroll bg-gray-800 p-2 rounded text-white">
        {chat.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
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
