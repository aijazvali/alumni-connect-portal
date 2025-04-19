// routes/userRoutes.js
import upload from '../utils/multer.js';
import express from "express"
const router = express.Router();
import User from "../models/User.js";
import requireAuth from "../middlewares/authMiddleware.js";


router.get("/profile", requireAuth, async (req, res) => {
  try {
    console.log("inside userroute for profile");
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



router.put(
  "/profile",
  requireAuth,
  async (req, res) => {
    try {
      console.log("inside profile controller....");
      const { name, branch, batch, jobtitle, location, image } = req.body;
      const updatedData = { name, branch, batch, jobtitle, location, image };

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updatedData,
        { new: true, runValidators: true }
      ).select("-password");

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);


export default router;
