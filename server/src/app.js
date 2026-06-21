import express from "express";
import { env } from "./config/env.js";
import { getApiInfo } from "./controllers/health.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

// Routes
import healthRoutes from "./routes/health.routes.js";
import promptsRoutes from "./routes/prompts.routes.js";
import jwtRoutes from "./routes/jwt.routes.js";
import usersRoutes from "./routes/users.routes.js";

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

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/prompts", promptsRoutes);
app.use("/api/jwt", jwtRoutes);
app.use("/api/users", usersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
