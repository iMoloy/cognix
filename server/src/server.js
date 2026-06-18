import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`Cognix API listening on port ${env.port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing Cognix API server.`);

  server.close(() => {
    console.log("Cognix API server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
