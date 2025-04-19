import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Send a new message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newMsg = new Message({ senderId, receiverId, message });
    const saved = await newMsg.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Message not sent." });
  }
});

// Fetch chat between two users
router.get("/:userId/:partnerId", async (req, res) => {
  try {
    const { userId, partnerId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch messages." });
  }
});

export default router;
