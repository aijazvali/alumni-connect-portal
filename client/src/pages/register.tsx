import { useState } from "react";
import CropImage from "@/components/CropImage";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    batch: "",
    jobtitle: "",
    branch: "",
    location: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [rawImage, setRawImage] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    let imageUrl = "";

    if (image) {
      const formDataImg = new FormData();
      formDataImg.append("file", image);
      formDataImg.append("upload_preset", "unsigned");

      try {
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dyl4tv4o6/image/upload", {
          method: "POST",
          body: formDataImg,
        });
        const cloudData = await cloudRes.json();
        imageUrl = cloudData.secure_url;
      } catch (err) {
        setMessage("❌ Failed to upload image");
        setMessageType("error");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("https://alumni-connect-portal.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registered successfully!");
        setMessageType("success");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
          batch: "",
          jobtitle: "",
          branch: "",
          location: "",
          image: "",
        });
        setImage(null);
        setImageSrc(null);
      } else {
        setMessage("❌ ${data.message}");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("❌ Server error");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 pt-8">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-black/60 backdrop-blur-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">Create Your Account</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center font-medium shadow ${
              messageType === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message}
          </div>
        )}

        {cropping && imageSrc && (
          <CropImage
            imageSrc={imageSrc}
            onCancel={() => setCropping(false)}
            onCropComplete={(croppedBlob: Blob) => {
              const file = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });
              setImage(file);
              setImageSrc(URL.createObjectURL(file)); // preview the cropped version
              setCropping(false);
            }}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "name", type: "text", placeholder: "Full Name" },
            { id: "email", type: "email", placeholder: "Email Address" },
            { id: "password", type: "password", placeholder: "Password" },
            { id: "batch", type: "text", placeholder: "Batch (e.g. 2023)" },
            { id: "jobtitle", type: "text", placeholder: "Job Title" },
            { id: "location", type: "text", placeholder: "Location" },
            { id: "branch", type: "text", placeholder: "Branch" },
          ].map((field) => (
            <input
              key={field.id}
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={(formData as any)[field.id]}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          ))}

          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setRawImage(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setCropping(true);
              };
              reader.readAsDataURL(file);
            }}
            className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer bg-gray-950 border border-gray-700 rounded-lg px-3 py-2"
          />

         
          {imageSrc && !cropping && (
            <div className="mt-2">
              <img
                src={imageSrc}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-700"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <span className="loader mr-2 w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                Submitting...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}