import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http"; // ✅ Required for Socket.io
import { Server } from "socket.io";

import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js"; // ✅ new route
import alumnifetch from "./controllers/alumnifetch.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS
app.use(cors({
  origin: "*", // Change this to your Vercel frontend URL in production
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads")); // (used for old posts)

connectDB();

// ✅ API Routes
app.get("/", (req, res) => res.send("Alumni Connect API Running"));
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes); // ✅ new message route
app.get("/alumni", alumnifetch);

// ✅ Set up server with Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Replace this with your frontend URL for production
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

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
