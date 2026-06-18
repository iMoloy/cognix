import { env } from "../config/env.js";
import { getDatabaseStatus } from "../db/client.js";

export const getApiInfo = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cognix API is running.",
    version: "1.0.0",
  });
};

export const getHealthStatus = async (req, res, next) => {
  try {
    const database = await getDatabaseStatus();

    res.status(200).json({
      success: true,
      status: "healthy",
      environment: env.nodeEnv,
      database,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
