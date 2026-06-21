import { getDatabase } from "../db/client.js";
import { ObjectId } from "mongodb";

export const getPrompts = async (req, res, next) => {
  try {
    const { search, category, tool, sort, page = 1, limit = 10 } = req.query;
    const db = getDatabase();
    
    // Build filter query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category) {
      // Support array if multiple passed, or comma separated
      const categories = Array.isArray(category) ? category : category.split(",");
      query.category = { $in: categories };
    }
    if (tool) {
      const tools = Array.isArray(tool) ? tool : tool.split(",");
      query.tool = { $in: tools };
    }

    // Build sort options
    let sortOptions = { createdAt: -1 };
    if (sort === "Most Copied") sortOptions = { copies: -1 };
    if (sort === "Highest Rated") sortOptions = { rating: -1 };
    if (sort === "Newest") sortOptions = { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    
    const prompts = await db.collection("prompts")
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const totalPrompts = await db.collection("prompts").countDocuments(query);
    const totalPages = Math.ceil(totalPrompts / limitNum);

    res.json({
      prompts,
      totalPages,
      currentPage: pageNum,
      totalPrompts
    });
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
