import express from "express";
import { env } from "./config/env.js";
import { getApiInfo } from "./controllers/health.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";

// Routes
import healthRoutes from "./routes/health.routes.js";
import promptsRoutes from "./routes/prompts.routes.js";
import usersRoutes from "./routes/users.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";

const app = express();

app.disable("x-powered-by");

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin && env.clientOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", getApiInfo);

app.use("/api/auth", async (req, res, next) => {
  if (req.method === "POST" && (req.path.includes("delete") || req.path.includes("remove"))) {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (session && session.user && session.user.email === "master@cognix.com") {
        return res.status(403).json({ error: "Master account cannot be deleted." });
      }
    } catch (error) {
      // ignore
    }
  }
  next();
});
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/health", healthRoutes);
app.use("/api/prompts", promptsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/payments", paymentsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
