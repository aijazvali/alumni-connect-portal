import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // redirect if no token
      return;
    }

    // Decode token to get user info (just for demo; not secure for production)
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload); // Show user info in the UI
  }, []);

  if (!user) return <div className="text-center mt-10">Checking authentication...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
      <p className="mb-2"><strong>User ID:</strong> {user.id}</p>
      <p className="mb-2"><strong>Role:</strong> {user.role}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
