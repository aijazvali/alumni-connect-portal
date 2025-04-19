'use client';
import { useEffect, useState } from "react";
import CropImage2 from "../components/CropImage2"; // make sure path is correct

interface User {
  name: string;
  branch: string;
  batch: string;
  jobtitle: string;
  location: string;
  image?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    batch: "",
    jobtitle: "",
    location: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://alumni-connect-portal.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || "",
          branch: data.branch || "",
          batch: data.batch || "",
          jobtitle: data.jobtitle || "",
          location: data.location || "",
          image: data.image || "",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setCropSrc(imageUrl); // open CropImage2 component
    }
  };

  const handleCropDone = (croppedFile: File) => {
    setFile(croppedFile);
    setFormData((prev) => ({
      ...prev,
      image: URL.createObjectURL(croppedFile),
    }));
    setCropSrc(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found");

    let imageUrl = formData.image;

    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "unsigned");
      uploadData.append("cloud_name", "dyl4tv4o6"); // Replace with your Cloudinary name

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dyl4tv4o6/image/upload", {
        method: "POST",
        body: uploadData,
      });

      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) {
        return alert("Image upload failed");
      }
      imageUrl = cloudData.secure_url;
    }

    try {
      const res = await fetch("https://alumni-connect-portal.onrender.com/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-300">Loading profile...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-6">
            <img
              src={
                formData.image ||
                "https://static.vecteezy.com/system/resources/previews/009/368/313/non_2x/scholarship-pixel-perfect-rgb-color-icon-for-dark-theme-financial-support-for-student-state-offered-grant-simple-filled-line-drawing-on-night-mode-background-editable-stroke-vector.jpg"
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-gray-700 shadow-md"
            />
            <label className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 15a2 2 0 012-2h2v2H4v2h2v2H4a2 2 0 01-2-2v-2z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
        </div>

        <div className="mt-6 space-y-4">
          {["name", "branch", "batch", "jobtitle", "location"].map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize text-gray-300">{field}</label>
              <input
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold mt-4 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>

      {cropSrc && (
        <CropImage2
          image={cropSrc}
          onCropDone={handleCropDone}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}
