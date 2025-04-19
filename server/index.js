import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIX: CORS settings to allow Vercel and localhost with preflight support
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://alumni-connect-portal-7mt5o1pj3-aijazs-projects-5ae8e876.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Alumni Connect Backend is Live! 🚀");
});

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
