import { env } from "../config/env.js";

export const getApiInfo = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cognix API is running.",
    version: "1.0.0",
  });
};

export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    environment: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
