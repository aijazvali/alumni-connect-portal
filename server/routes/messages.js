import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// POST a new message
router.post("/", async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  // ✅ Debug Log to verify request
  console.log("Incoming message to save:", { senderId, receiverId, message });

  if (!senderId || !receiverId || !message) {
    console.warn("❌ Missing message data");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    });

    const saved = await newMessage.save();
    console.log("✅ Message saved:", saved);  // Debug log to confirm save

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving message to DB:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all messages between two users
router.get("/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
