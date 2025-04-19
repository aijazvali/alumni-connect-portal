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

app.use(cors({
  origin: ["http://localhost:3000", "https://alumni-connect-portal.vercel.app"],
  credentials: true
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Alumni Connect Backend is Live! 🚀");
});

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.use("/uploads", express.static("uploads"));

