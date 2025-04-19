import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("https://alumni-connect-portal.onrender.com/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("User fetch error:", err));
  }, []);

  const handleClick = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Private Chat</h2>
      <div className="space-y-2">
        {users.map((user: any) => (
          <button
            key={user._id}
            onClick={() => handleClick(user._id)}
            className="w-full bg-gray-800 text-white p-3 rounded hover:bg-gray-700"
          >
            {user.username} ({user.role})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
