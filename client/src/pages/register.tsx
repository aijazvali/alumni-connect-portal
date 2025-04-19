import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    batch: "",
    jobtitle:"",
    branch:"",
    location:""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registered successfully!");
        setFormData({ name: "", email: "", password: "", role: "", batch: "" ,jobtitle:"",branch:"",location:""});
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">Register</h1>

      {message && (
        <div className="mb-4 p-3 rounded text-white bg-blue-600">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <select
          id="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select role</option>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
        <input
          id="batch"
          type="text"
          placeholder="Batch (e.g. 2023)"
          value={formData.batch}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          id="jobtitle"
          type="text"
          placeholder="Jobtitle"
          value={formData.jobtitle}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          id="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          id="branch"
          type="text"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
