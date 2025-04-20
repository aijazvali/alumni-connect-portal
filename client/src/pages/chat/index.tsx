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
      <h1 className="text-2xl font-bold mb-6 text-center">Start a Chat</h1>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => router.push(`/chat/${user._id}`)}
            className="w-full p-4 rounded-xl shadow-lg bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{user.name}</div>
                <div className="text-sm text-gray-300">{user.role}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
