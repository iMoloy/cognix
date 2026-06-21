import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/analytics
router.get("/", verifyToken, getAnalytics);

export default router;
