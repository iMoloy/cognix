import { env } from "../config/env.js";

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error.",
    ...(env.nodeEnv === "development" && { stack: error.stack }),
  });
};
