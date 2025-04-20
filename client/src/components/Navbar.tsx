import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authhook } from "@/authcontext/Authcontext";

export default function Navbar() {
  const auth = authhook();
  const [userInfo, setUserInfo] = useState<{ name?: string; role?: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserInfo(null);
      return;
    }

    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    setUserInfo({ name: name || "", role: role || "" });
  };

  useEffect(() => {
    checkAuth();
    const handleRouteChange = () => checkAuth();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
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
    <nav className="bg-black text-white px-6 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
          <span className="text-lg font-bold text-blue-400">Back2Campus</span>
        </Link>

        <button
          className="sm:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      <div className={`mt-3 sm:mt-0 ${isOpen ? "block" : "hidden"} sm:flex sm:items-center sm:justify-end sm:gap-6`}>
        <Link href="/home" className="block py-2 sm:py-0 hover:text-blue-400">Home</Link>
        <Link href="/alumni" className="block py-2 sm:py-0 hover:text-blue-400">Alumni</Link>
        {auth.user && (
          <Link href="/profile" className="block py-2 sm:py-0 hover:text-blue-400">
            Profile
          </Link>
        )}

        {userInfo ? (
          <>
            <Link href="/user" className="block py-2 sm:py-0 hover:text-blue-400">
              👤 {userInfo.name} ({userInfo.role})
            </Link>
            <Link href="/chat" className="block py-2 sm:py-0 text-pink-400 font-semibold hover:underline">
              Messages
            </Link>
            <button
              onClick={handleLogout}
              className="block py-2 sm:py-0 hover:text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="block py-2 sm:py-0 hover:text-blue-400">Login</Link>
            <Link href="/register" className="block py-2 sm:py-0 hover:text-blue-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
