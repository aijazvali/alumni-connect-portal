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

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"]; // Add other frontend URLs if needed
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // Allow cookies and credentials
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Alumni Connect Backend is Live! 🚀");
});

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.get("/alumni",alumnifetch);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.use("/uploads", express.static("uploads"));

