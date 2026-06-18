import app from "./app.js";
import { env } from "./config/env.js";
import { closeDatabase, connectDatabase } from "./db/client.js";

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      console.log(`Cognix API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Cognix API failed to start.", error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing Cognix API server.`);

  await closeDatabase();

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log("Cognix API server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
