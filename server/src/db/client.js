import { MongoClient } from "mongodb";
import { env } from "../config/env.js";
import { createDatabaseIndexes } from "./indexes.js";

let client;
let database;

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    console.warn("MONGODB_URI is not set. Database connection skipped.");
    return null;
  }

  if (database) {
    return database;
  }

  client = new MongoClient(env.mongodbUri);

  try {
    await client.connect();
    database = client.db(env.databaseName);

    // Keep required indexes ready before feature routes start using collections.
    await createDatabaseIndexes(database);

    console.log(`MongoDB connected to database: ${env.databaseName}`);
    return database;
  } catch (error) {
    console.error("MongoDB connection failed.", error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!database) {
    throw new Error("Database is not connected.");
  }

  return database;
};

export const getDatabaseStatus = async () => {
  if (!database) {
    return {
      connected: false,
      status: env.mongodbUri ? "disconnected" : "not_configured",
    };
  }

  try {
    await database.command({ ping: 1 });

    return {
      connected: true,
      status: "connected",
      name: database.databaseName,
    };
  } catch (error) {
    return {
      connected: false,
      status: "unhealthy",
      message: error.message,
    };
  }
};

export const closeDatabase = async () => {
  if (!client) {
    return;
  }

  await client.close();
  client = undefined;
  database = undefined;
};

