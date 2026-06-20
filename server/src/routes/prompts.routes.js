import { Router } from "express";
import { getPrompts, getPromptById } from "../controllers/prompts.controller.js";

const router = Router();

router.get("/", getPrompts);
router.get("/:id", getPromptById);

export default router;
