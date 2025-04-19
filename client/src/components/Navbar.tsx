import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    role?: string;
  } | null>(null);
  const router = useRouter();

  // ✅ Check for token and user info in localStorage
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserInfo(null);
      return;
    }

    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    setUserInfo({
      name: name || "",
      role: role || "",
    });
  };

  useEffect(() => {
    checkAuth();

    // ✅ Re-check whenever route changes (e.g., after login/logout)
    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUserInfo(null);
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-400">
        <Link href="/">Alumni Connect</Link>
      </h1>
      <div className="flex items-center gap-4">
        {/* 🏠 Home link shown to everyone */}
        <Link href="/" className="hover:text-blue-400">
          Home
        </Link>

        {userInfo ? (
          <>
            {/* ✅ Show logged-in user's name and role */}
            <span className="text-sm text-gray-300">
              👤 {userInfo.name} ({userInfo.role})
            </span>
            <Link href="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* ✅ Show login/register if user is not logged in */}
            <Link href="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link href="/register" className="hover:text-blue-400">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
