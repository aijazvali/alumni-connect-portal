import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import path from "path";
import alumnifetch from "./controllers/alumnifetch.js"



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS for localhost and Vercel
app.use(cors({
  origin: "*", // Temporarily allow all origins
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
app.get("/alumni",alumnifetch);


// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
