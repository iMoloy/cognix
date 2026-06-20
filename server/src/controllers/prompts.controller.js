import { getDatabase } from "../db/client.js";
import { ObjectId } from "mongodb";

export const getPrompts = async (req, res, next) => {
  try {
    const db = getDatabase();
    const prompts = await db.collection("prompts").find({}).sort({ createdAt: -1 }).toArray();
    res.json(prompts);
  } catch (error) {
    next(error);
  }
};

export const getPromptById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid prompt ID format" });
    }

    const db = getDatabase();
    const prompt = await db.collection("prompts").findOne({ _id: new ObjectId(id) });
    
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    
    res.json(prompt);
  } catch (error) {
    next(error);
  }
};
