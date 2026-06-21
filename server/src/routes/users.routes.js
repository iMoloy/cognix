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

// Get Top Creators (Public)
router.get("/top-creators", async (req, res) => {
  try {
    const db = getDatabase();
    // Fetch users with role creator or admin
    const creators = await db.collection("users")
      .find({ role: { $in: ["creator", "admin", "user"] } }) // Right now any user can be a creator for demo
      .limit(8)
      .toArray();

    // Map through and get their prompt count, total copies, avg rating from prompts collection
    const enhancedCreators = await Promise.all(creators.map(async (creator) => {
      const prompts = await db.collection("prompts").find({ creatorId: creator._id.toString() }).toArray();
      const promptsCount = prompts.length;
      const copies = prompts.reduce((acc, p) => acc + (p.copies || 0), 0);
      const rating = promptsCount > 0 
        ? (prompts.reduce((acc, p) => acc + parseFloat(p.rating || 0), 0) / promptsCount).toFixed(1) 
        : "0.0";

      return {
        _id: creator._id,
        name: creator.name,
        role: creator.role === "admin" ? "Platform Admin" : "AI Prompt Creator",
        image: creator.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name || "User")}`,
        copies,
        rating,
        promptsCount,
        specialties: ["Engineering", "Design", "Marketing"].sort(() => 0.5 - Math.random()).slice(0, 2)
      };
    }));

    // Sort by copies
    enhancedCreators.sort((a, b) => b.copies - a.copies);

    res.send(enhancedCreators);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch top creators", error });
  }
});

// Get Creator by ID
router.get("/creator/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid creator ID" });
    }

    const db = getDatabase();
    const creator = await db.collection("users").findOne({ _id: new ObjectId(id) });
    
    if (!creator) {
      return res.status(404).send({ message: "Creator not found" });
    }

    const prompts = await db.collection("prompts").find({ creatorId: id }).toArray();
    const promptsCount = prompts.length;
    const copies = prompts.reduce((acc, p) => acc + (p.copies || 0), 0);
    const rating = promptsCount > 0 
      ? (prompts.reduce((acc, p) => acc + parseFloat(p.rating || 0), 0) / promptsCount).toFixed(1) 
      : "0.0";

    const enhancedCreator = {
      _id: creator._id,
      name: creator.name,
      role: creator.role === "admin" ? "Platform Admin" : "AI Prompt Creator",
      bio: "An AI enthusiast and prompt engineer building tools for the modern web.",
      location: "Global",
      website: "cognix.com",
      image: creator.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name || "User")}`,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      joinedDate: new Date(creator.createdAt || Date.now()).toLocaleDateString(),
      verified: true,
      copies,
      rating,
      promptsCount,
      followers: Math.floor(Math.random() * 5000),
      prompts
    };

    res.send(enhancedCreator);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch creator details", error });
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

// Update User Profile by Email
router.patch("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { name, photoURL, role } = req.body;
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const filter = { email };
    
    // Build update document dynamically based on provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (photoURL !== undefined) updateFields.photoURL = photoURL;
    if (role) updateFields.role = role;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send({ message: "No fields to update" });
    }

    const updateDoc = {
      $set: updateFields
    };
    
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update profile", error });
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
