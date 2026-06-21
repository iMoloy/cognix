import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db/client.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Add a review
router.post("/", verifyToken, async (req, res) => {
  try {
    const { promptId, rating, comment, userEmail, userName } = req.body;
    
    if (!promptId || !rating) return res.status(400).send({ message: "Missing fields" });

    const db = getDatabase();
    const newReview = {
      promptId: new ObjectId(promptId),
      rating: Number(rating),
      comment,
      userEmail,
      userName,
      createdAt: new Date()
    };

    const result = await db.collection("reviews").insertOne(newReview);
    res.status(201).send({ message: "Review added", reviewId: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: "Error adding review", error });
  }
});

// Get reviews by prompt ID
router.get("/prompt/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const reviews = await db.collection("reviews")
      .find({ promptId: new ObjectId(req.params.id) })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(reviews);
  } catch (error) {
    res.status(500).send({ message: "Error fetching reviews", error });
  }
});

// Get user's reviews
router.get("/user/:email", verifyToken, async (req, res) => {
  try {
    const db = getDatabase();
    const reviews = await db.collection("reviews")
      .find({ userEmail: req.params.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(reviews);
  } catch (error) {
    res.status(500).send({ message: "Error fetching user reviews", error });
  }
});

export default router;
