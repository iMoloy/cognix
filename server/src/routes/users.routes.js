import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db/client.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

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

    if (user.email === "admin@example.com" || user.email === "admin@cognix.com") {
      user.role = "admin";
    } else if (user.email === "creator@example.com" || user.email === "creator@cognix.com") {
      user.role = "creator";
    } else {
      user.role = "user"; // default role
    }

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

// Get All Users (Admin Only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");
    const users = await usersCollection.find().toArray();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users", error });
  }
});

// Update User Role (Admin Only)
router.patch("/role/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;
    const db = getDatabase();
    const usersCollection = db.collection("users");
    
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: { role }
    };
    
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update role", error });
  }
});

// Delete User (Admin Only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const db = getDatabase();
    const usersCollection = db.collection("users");
    
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete user", error });
  }
});

export default router;
