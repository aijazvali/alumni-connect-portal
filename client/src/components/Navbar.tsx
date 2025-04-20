import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authhook } from "@/authcontext/Authcontext";

export default function Navbar() {
  const auth = authhook();
  const [userInfo, setUserInfo] = useState<{
    name?: string;
    role?: string;
  } | null>(null);
  const router = useRouter();

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

    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setUserInfo(null);
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-400">
      <Link href="/" className="flex items-center gap-2">
  <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
  <span className="text-lg font-bold text-blue-400">Back2Campus</span>
</Link>


      </h1>

      <div className="flex items-center gap-4">
        <Link href="/" className="hover:text-blue-400">Home</Link>
        <Link href="/alumni" className="hover:text-blue-400">Alumni</Link>
        {auth.user && <Link href="/profile">Profile</Link>}
        
        {userInfo ? (
          <>
            <Link href="/user">
            👤 {userInfo.name} ({userInfo.role})
            </Link>
            <Link href="/chat" className="text-pink-400 font-semibold hover:underline">
              Messages
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
            <Link href="/login" className="hover:text-blue-400">Login</Link>
            <Link href="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
