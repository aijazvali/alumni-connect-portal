import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Post from "../models/Post.js";
import multer from "multer";
import path from "path"

dotenv.config();

const router = express.Router();

// 🔐 Middleware to check JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👤 id, name, role
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Store images in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// 📥 Create a new post
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
    try {
      const { content } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
      const post = new Post({
        user: req.user.id,
        name: req.user.name,
        role: req.user.role,
        content,
        imageUrl
      });
  
      const saved = await post.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error("Post error:", err);
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  

// 📤 Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.post("/:id/comments", async (req, res) => {
    const { text, author } = req.body;
  
    if (!text || !author) {
      return res.status(400).json({ message: "Comment text and author are required." });
    }
  
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.comments.push({ text, author });
      await post.save();
  
      res.status(201).json(post);
    } catch (error) {
      console.error("Add comment error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;
