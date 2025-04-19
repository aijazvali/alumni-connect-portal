"use client";
import { useEffect, useState } from "react";
import Chat from "../components/Chat";

export default function ChatPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("https://alumni-connect-portal.onrender.com/alumni") // or your /api/users endpoint
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((user: any) => user._id !== currentUserId);
        setUsers(filtered);
      });
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Chat With Alumni</h1>

      {!selectedUserId ? (
        <div className="grid gap-3">
          {users.map((user) => (
            <button
              key={user._id}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              onClick={() => setSelectedUserId(user._id)}
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
