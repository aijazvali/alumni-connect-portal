import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    batch: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://alumni-connect-portal.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful!");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <>
      <Head>
        <title>Register | Alumni Connect</title>
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="bg-black shadow-md rounded px-6 py-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Register</h2>

          {message && (
            <div className="mb-4 p-3 rounded text-white bg-green-600 text-sm">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-white mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-white mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-white mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
                placeholder="Choose a strong password"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm text-white mb-1">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div>
              <label htmlFor="batch" className="block text-sm text-white mb-1">Batch</label>
              <input
                type="text"
                id="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-800 text-white"
                placeholder="e.g., 2022"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
