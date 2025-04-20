import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { authhook } from "@/authcontext/Authcontext";

export default function Login() {
  const auth = authhook();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("https://alumni-connect-portal.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user._id);

        setMessage("✅ Login successful!");
        auth.setUser(data.user);
        router.push("/home");
      } else {
        setMessage("❌ ${data.message}");
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Alumni Connect</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-black/60 backdrop-blur-md border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center tracking-wide text-white">
            Login to Your Account
          </h2>

          {message && (
            <div className="mb-4 p-3 rounded text-white bg-blue-600 text-center font-medium shadow">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <span className="loader mr-2 w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}