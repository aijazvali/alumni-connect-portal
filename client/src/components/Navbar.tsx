import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700">Alumni Connect</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-700">Home</Link>
        <Link href="/login" className="text-gray-700 hover:text-blue-700">Login</Link>
        <Link href="/register" className="text-gray-700 hover:text-blue-700">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
