import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  _id: string;
  name: string;
  role: string;
}

const ChatListPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    fetch("https://alumni-connect-portal.onrender.com/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((u) => u._id !== currentUserId);
          setUsers(filtered);
        }
      })
      .catch((err) => console.error("Error fetching users", err));
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Start a Chat</h1>
      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => router.push(`/chat/${user._id}`)}
          className="block w-full p-3 rounded bg-gray-700 hover:bg-gray-600 text-left mb-2"
        >
          {user.name} ({user.role})
        </button>
      ))}
    </div>
  );
};

export default ChatListPage;
