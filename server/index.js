import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/users.js";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js";
import alumnifetch from "./controllers/alumnifetch.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

connectDB();

// API Routes
app.get("/", (req, res) => res.send("Alumni Connect API Running"));
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.get("/alumni", alumnifetch);

// ✅ Create HTTP server and wrap socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on("private_message", (data) => {
    const { senderId, receiverId, message } = data;
    console.log("📩 Message sent:", data);
    socket.to(receiverId).emit("private_message", {
      senderId,
      message,
      timestamp: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ ONLY use server.listen (no app.listen)
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
