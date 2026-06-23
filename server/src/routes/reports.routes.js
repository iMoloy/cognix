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

// Delete a report (Dismiss or Admin Action)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const db = getDatabase();
    const reportsCollection = db.collection("reports");
    
    const query = { _id: new ObjectId(id) };
    const result = await reportsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete report", error });
  }
});

// Warn creator of reported prompt (Admin only)
router.post("/:id/warn", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reportId = req.params.id;
    const db = getDatabase();
    
    // 1. Get the report
    const report = await db.collection("reports").findOne({ _id: new ObjectId(reportId) });
    if (!report) return res.status(404).send({ message: "Report not found" });
    
    // 2. Get the prompt to find creatorId
    const prompt = await db.collection("prompts").findOne({ _id: new ObjectId(report.promptId) });
    if (!prompt) return res.status(404).send({ message: "Prompt not found" });
    
    if (prompt.creatorId) {
      // 3. Increment warningsCount and push to warnings log for the creator
      await db.collection("users").updateOne(
        { _id: new ObjectId(prompt.creatorId) },
        { 
          $inc: { warningsCount: 1 },
          $push: { 
            warnings: {
              reportId: new ObjectId(reportId),
              promptId: prompt._id,
              promptTitle: prompt.title,
              reason: report.reason,
              date: new Date()
            }
          }
        }
      );
    }
    
    // 4. Delete the report as it is now resolved
    await db.collection("reports").deleteOne({ _id: new ObjectId(reportId) });
    
    res.send({ message: "Creator warned and report resolved" });
  } catch (error) {
    res.status(500).send({ message: "Error warning creator", error });
  }
});

export default router;
