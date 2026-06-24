import { Router } from "express";
import { 
  getPrompts, 
  getPromptById,
  getAdminPrompts,
  getCreatorPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
  forkPrompt
} from "../controllers/prompts.controller.js";
import { verifyToken, verifyAdmin, verifyCreator } from "../middleware/auth.middleware.js";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db/client.js";

const router = Router();

// Public Routes
router.get("/", getPrompts);

// Admin Routes
router.get("/admin/all", verifyToken, verifyAdmin, getAdminPrompts);

// Creator Routes
router.get("/creator/:id", verifyToken, verifyCreator, getCreatorPrompts);
router.post("/", verifyToken, verifyCreator, createPrompt);

// Increment copyCount for a prompt
router.post("/:id/copy", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid prompt ID" });
    }

    const db = getDatabase();
    const result = await db.collection("prompts").updateOne(
      { _id: new ObjectId(id) },
      { $inc: { copyCount: 1, copies: 1 } } // increment both just in case
    );

    res.send({ message: "Copy count incremented", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to increment copy count", error });
  }
});

// Fork a prompt
router.post("/:id/fork", verifyToken, verifyCreator, forkPrompt);

// Protected Routes (handled in controller for specific permissions)
router.patch("/:id", verifyToken, updatePrompt);
router.delete("/:id", verifyToken, deletePrompt);

// Must be last to not conflict with /admin or /creator
router.get("/:id", getPromptById);

export default router;
