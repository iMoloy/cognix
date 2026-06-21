import { Router } from "express";
import User from "../models/user.model.js";

const router = Router();

// Save or Update a User
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    // Check if user already exists
    const query = { email: user.email };
    const existingUser = await User.findOne(query);
    
    if (existingUser) {
      return res.send({ message: "User already exists", insertedId: null });
    }

    const result = await User.create(user);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to save user", error });
  }
});

// Get User Role and Data by Email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const result = await User.findOne({ email });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user", error });
  }
});

export default router;
