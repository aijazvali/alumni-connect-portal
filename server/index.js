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

// ✅ CORS for localhost and Vercel
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

// ✅ Static files for images (⚠️ Render deletes these after a while)
app.use("/uploads", express.static("uploads"));

// ✅ Connect DB
connectDB();

// ✅ Routes
app.get("/", (req, res) => res.send("✅ Alumni Connect API Running"));
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
