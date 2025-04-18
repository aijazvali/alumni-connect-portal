import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import express from "express";


const router = express.Router();

// @route POST /api/register
router.post("/register", async (req, res) => {
  const { name, email, password, role, batch } = req.body;

  if (!name || !email || !password || !role || !batch) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      batch
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
