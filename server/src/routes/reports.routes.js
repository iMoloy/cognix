import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db/client.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Submit a report
router.post("/", verifyToken, async (req, res) => {
  try {
    const { promptId, promptTitle, reason, description, userEmail } = req.body;
    
    if (!promptId || !reason) return res.status(400).send({ message: "Missing fields" });

    const db = getDatabase();
    const newReport = {
      promptId: new ObjectId(promptId),
      promptTitle,
      reason,
      description,
      userEmail,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("reports").insertOne(newReport);
    res.status(201).send({ message: "Report submitted", reportId: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: "Error submitting report", error });
  }
});

// Get all reports (Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    const reports = await db.collection("reports").find().sort({ createdAt: -1 }).toArray();
    res.send(reports);
  } catch (error) {
    res.status(500).send({ message: "Error fetching reports", error });
  }
});

// Update report status (Admin only)
router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const db = getDatabase();
    
    await db.collection("reports").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );
    res.send({ message: "Report updated" });
  } catch (error) {
    res.status(500).send({ message: "Error updating report", error });
  }
});

export default router;
