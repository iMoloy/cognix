import { Router } from "express";
import { 
  getPrompts, 
  getPromptById,
  getAdminPrompts,
  getCreatorPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt
} from "../controllers/prompts.controller.js";
import { verifyToken, verifyAdmin, verifyCreator } from "../middleware/auth.middleware.js";

const router = Router();

// Public Routes
router.get("/", getPrompts);

// Admin Routes
router.get("/admin/all", verifyToken, verifyAdmin, getAdminPrompts);

// Creator Routes
router.get("/creator/:id", verifyToken, verifyCreator, getCreatorPrompts);
router.post("/", verifyToken, verifyCreator, createPrompt);

// Protected Routes (handled in controller for specific permissions)
router.patch("/:id", verifyToken, updatePrompt);
router.delete("/:id", verifyToken, deletePrompt);

// Must be last to not conflict with /admin or /creator
router.get("/:id", getPromptById);

export default router;
