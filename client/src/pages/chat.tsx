import { useEffect, useState } from "react";
import Chat from "@/components/Chat";

export default function ChatPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setCurrentUserId(id);

    fetch("https://alumni-connect-portal.onrender.com/alumni")
      .then(res => res.json())
      .then(data => {
        const filtered = id ? data.filter((u: any) => u._id !== id) : data;
        setUsers(filtered);
      });
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4 font-bold">Private Chat</h1>
      {!currentUserId ? (
        <p>Please log in to use chat</p>
      ) : !selectedUserId ? (
        <div className="grid gap-2">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUserId(user._id)}
              className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
            >
              {user.name} ({user.role})
            </button>
          ))}
        </div>
      ) : (
        <Chat currentUserId={currentUserId} selectedUserId={selectedUserId} />
      )}
    </div>
  );
}
