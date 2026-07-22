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

    const followsCollection = db.collection("follows");

    // Map through and get their prompt count, total copies, avg rating from prompts collection
    const enhancedCreators = await Promise.all(creators.map(async (creator) => {
      const prompts = await db.collection("prompts").find({ creatorId: creator._id.toString() }).toArray();
      const promptsCount = prompts.length;
      const copies = prompts.reduce((acc, p) => acc + (p.copies || 0), 0);
      const rating = promptsCount > 0 
        ? (prompts.reduce((acc, p) => acc + parseFloat(p.rating || 0), 0) / promptsCount).toFixed(1) 
        : "0.0";

      const followers = await followsCollection.countDocuments({ creatorId: creator._id.toString() });

      return {
        _id: creator._id,
        name: creator.name,
        role: creator.role === "admin" ? "Platform Admin" : "AI Prompt Creator",
        image: creator.image || creator.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creator.name || "User")}`,
        copies,
        rating,
        promptsCount,
        followers,
        specialties: ["Engineering", "Design", "Marketing"].slice(0, 2)
      };
    }));

    // Sort by copies
    enhancedCreators.sort((a, b) => b.copies - a.copies);

    res.send(enhancedCreators);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch top creators", error });
  }
});

// Toggle Follow Creator
router.post("/follow", verifyToken, async (req, res) => {
  try {
    const followerEmail = req.decoded?.email;
    const { creatorId } = req.body;

    if (!followerEmail || !creatorId) {
      return res.status(400).send({ message: "Missing follower email or creatorId" });
    }

    const db = getDatabase();
    const followsCollection = db.collection("follows");

    const existingFollow = await followsCollection.findOne({ followerEmail, creatorId });

    if (existingFollow) {
      await followsCollection.deleteOne({ followerEmail, creatorId });
      const count = await followsCollection.countDocuments({ creatorId });
      return res.send({ message: "Unfollowed creator", isFollowing: false, followersCount: count });
    } else {
      await followsCollection.insertOne({
        followerEmail,
        creatorId,
        createdAt: new Date()
      });
      const count = await followsCollection.countDocuments({ creatorId });
      return res.send({ message: "Following creator", isFollowing: true, followersCount: count });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to toggle follow status", error });
  }
});

// Get Creator by ID
router.get("/creator/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.query;
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

    const followsCollection = db.collection("follows");
    const followersCount = await followsCollection.countDocuments({ creatorId: id });
    
    let isFollowing = false;
    if (userEmail) {
      const followDoc = await followsCollection.findOne({ followerEmail: userEmail, creatorId: id });
      isFollowing = Boolean(followDoc);
    }

    const enhancedCreator = {
      _id: creator._id,
      name: creator.name,
      role: creator.role === "admin" ? "Platform Admin" : "AI Prompt Creator",
      bio: "An AI enthusiast and prompt engineer building tools for the modern web.",
      location: "Global",
      website: "cognix.com",
      image: creator.image || creator.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creator.name || "User")}`,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      joinedDate: new Date(creator.createdAt || Date.now()).toLocaleDateString(),
      verified: true,
      copies,
      rating,
      promptsCount,
      followers: followersCount,
      isFollowing,
      prompts
    };

    res.send(enhancedCreator);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch creator details", error });
  }
});

// Get User Dashboard Overview Stats (Logged in user)
// IMPORTANT: This MUST come BEFORE the generic /:email route to avoid being swallowed by it
router.get("/dashboard-stats/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    
    // Verify that the requested email matches the logged-in user's email
    if (req.decoded?.email !== email) {
      return res.status(403).json({ message: "Forbidden access to other user's stats" });
    }

    const db = getDatabase();
    
    // 1. Get user document
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Count unlocked prompts
    const isPremiumUser = user.subscription === "premium" || user.role === "admin" || user.role === "creator";
    const approvedFilter = { $or: [{ status: "approved" }, { status: { $exists: false } }] };
    
    let unlocked = 0;
    if (isPremiumUser) {
      unlocked = await db.collection("prompts").countDocuments(approvedFilter);
    } else {
      unlocked = await db.collection("prompts").countDocuments({ 
        ...approvedFilter, 
        isPremium: { $ne: true } 
      });
    }

    // 3. Count saved prompts (bookmarks)
    const saved = user.bookmarks?.length || 0;

    // 4. Calculate total spend (succeeded payments)
    const payments = await db.collection("payments").find({ email, status: "succeeded" }).toArray();
    const spend = payments.reduce((acc, p) => acc + (p.amount || 0), 0) / 100;

    // 5. Get recent prompts (activity)
    const recentActivity = await db.collection("prompts")
      .find(approvedFilter)
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();

    // 6. Join date formatting
    const joinDate = user.createdAt 
      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "June 2026";

    res.send({
      joinDate,
      stats: {
        unlocked,
        saved,
        spend
      },
      recentActivity
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch dashboard stats", error });
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

// Toggle Bookmark Prompt (Logged in user)
router.post("/bookmark", verifyToken, async (req, res) => {
  try {
    const email = req.decoded?.email;
    const { promptId } = req.body;
    
    if (!email || !promptId) {
      return res.status(400).send({ message: "Missing email or promptId" });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");
    const bookmarksCollection = db.collection("bookmarks");

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const bookmarks = user.bookmarks || [];
    const isBookmarked = bookmarks.includes(promptId);

    if (isBookmarked) {
      // Remove from user array
      await usersCollection.updateOne({ email }, { $pull: { bookmarks: promptId } });
      // Remove from bookmarks collection
      await bookmarksCollection.deleteOne({ email, promptId });
      res.send({ message: "Bookmark removed", isBookmarked: false });
    } else {
      // Add to user array
      await usersCollection.updateOne({ email }, { $push: { bookmarks: promptId } });
      // Add to bookmarks collection
      await bookmarksCollection.insertOne({
        email,
        userId: user._id.toString(),
        promptId,
        createdAt: new Date(),
      });
      res.send({ message: "Prompt bookmarked", isBookmarked: true });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to toggle bookmark", error });
  }
});

// Get Bookmarked Prompts
router.get("/bookmarks/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    const db = getDatabase();
    
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const bookmarks = user.bookmarks || [];
    if (bookmarks.length === 0) return res.send([]);

    const objectIds = bookmarks.map(id => {
      try { return new ObjectId(id); } catch(e) { return null; }
    }).filter(Boolean);

    const prompts = await db.collection("prompts").find({ _id: { $in: objectIds } }).toArray();
    res.send(prompts);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch bookmarks", error });
  }
});

// Get All Users (Admin Only) with Pagination
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const db = getDatabase();
    const usersCollection = db.collection("users");
    
    const totalUsers = await usersCollection.countDocuments();
    const users = await usersCollection.find().skip(skip).limit(limit).toArray();
    
    res.send({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });
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
    
    // PREVENT DELETING MASTER ADMIN
    const userToDelete = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (userToDelete && userToDelete.email === "master@cognix.com") {
      return res.status(403).send({ message: "Master account cannot be deleted." });
    }
    
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete user", error });
  }
});

// NOTE: dashboard-stats route was moved above /:email to prevent route swallowing.

export default router;
