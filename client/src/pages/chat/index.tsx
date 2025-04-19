import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ChatList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      fetch("https://alumni-connect-portal.onrender.com/api/users")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((u: any) => u._id !== user._id);
          setUsers(filtered);
        })
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, []);

  const handleClick = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Private Chat</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => handleClick(user._id)}
            className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-left"
          >
            {user.name} ({user.role})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
