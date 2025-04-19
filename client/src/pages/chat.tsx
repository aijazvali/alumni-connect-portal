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
          setUsers(data.filter((u) => u._id !== currentUserId)); // exclude current user
        } else {
          console.error("Invalid users data", data);
        }
      })
      .catch((err) => console.error("Error fetching users", err));
  }, [currentUserId]);

  const startChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Private Chat</h1>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => startChat(user._id)}
            className="block w-full p-3 rounded bg-gray-700 hover:bg-gray-600"
          >
            {user.name} ({user.role})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
