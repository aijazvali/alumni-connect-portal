import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("userRole"));
    setName(localStorage.getItem("userName"));
  }, []);

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">🎓 Alumni Portal</Link>
        <button
          className="sm:hidden text-xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      <div className={`${open ? "block" : "hidden"} sm:flex sm:items-center sm:gap-6 mt-3 sm:mt-0`}>
        <Link href="/" className="block py-2 sm:py-0 hover:text-blue-400">Home</Link>
        <Link href="/chat" className="block py-2 sm:py-0 hover:text-blue-400">Messages</Link>
        <Link href="/dashboard" className="block py-2 sm:py-0 hover:text-blue-400">Dashboard</Link>

        {name && (
          <div className="mt-2 sm:mt-0 sm:ml-auto text-sm text-gray-300">
            Logged in as <span className="font-semibold text-white">{name}</span> ({role})
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
