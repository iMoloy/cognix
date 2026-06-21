import { Router } from "express";
import { getDatabase } from "../db/client.js";

const router = Router();

// Save or Update a User
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const db = getDatabase();
    const usersCollection = db.collection("users");
    // Check if user already exists
    const query = { email: user.email };
    const existingUser = await usersCollection.findOne(query);
    
    if (existingUser) {
      return res.send({ message: "User already exists", insertedId: null });
    }

    user.role = "user"; // default role
    user.subscription = "free"; // default subscription
    user.createdAt = new Date();
    
    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to save user", error });
  }
});

// Get User Role and Data by Email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const db = getDatabase();
    const usersCollection = db.collection("users");
    const result = await usersCollection.findOne({ email });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user", error });
  }
});

export default router;
