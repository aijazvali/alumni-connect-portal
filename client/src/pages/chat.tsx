import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ChatList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setCurrentUserId(id);

    // Fetch all users
    fetch("https://alumni-connect-portal.onrender.com/api/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Exclude current user
          setUsers(data.filter(user => user._id !== id));
        } else {
          console.warn("Invalid user list:", data);
        }
      });
  }, []);

  const goToChat = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  return (
    <div className="p-4 max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold text-white mb-4">Private Chat</h1>
      {users.map(user => (
        <button
          key={user._id}
          onClick={() => goToChat(user._id)}
          className="block w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded mb-2 text-center"
        >
          {user.name} ({user.role})
        </button>
      ))}
    </div>
  );
};

export default ChatList;
