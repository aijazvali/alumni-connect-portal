import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  _id: string;
  name: string;
  role: string;
  image?: string;
}

const ChatListPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
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

  // Filtered + Sorted Users
  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      return sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Start a Chat</h1>

      {/* Search + Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-gray-700 text-white w-full sm:w-1/2"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500 transition"
        >
          Sort: {sortAsc ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* User Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => router.push(`/chat/${user._id}`)}
            className="w-full p-4 rounded-xl shadow-lg bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.image || "/default-avatar.png"}
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
              />
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
