import { getDatabase } from "../db/client.js";
import { ObjectId } from "mongodb";

export const getPrompts = async (req, res, next) => {
  try {
    const { search, category, tool, sort, page = 1, limit = 10 } = req.query;
    const db = getDatabase();
    
    // Build filter query
    const query = {
      $or: [{ status: "approved" }, { status: { $exists: false } }]
    };
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

export const getAdminPrompts = async (req, res, next) => {
  try {
    const db = getDatabase();
    // Admins get everything, sorted by newest
    const prompts = await db.collection("prompts").find({}).sort({ createdAt: -1 }).toArray();
    res.json(prompts);
  } catch (error) {
    next(error);
  }
};

export const getCreatorPrompts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const prompts = await db.collection("prompts").find({ creatorId: id }).sort({ createdAt: -1 }).toArray();
    res.json(prompts);
  } catch (error) {
    next(error);
  }
};

export const createPrompt = async (req, res, next) => {
  try {
    const db = getDatabase();
    const newPrompt = {
      ...req.body,
      status: "pending",
      featured: false,
      copies: 0,
      rating: "0.0",
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection("prompts").insertOne(newPrompt);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePrompt = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const db = getDatabase();
    const email = req.decoded.email;

    const user = await db.collection("users").findOne({ email });
    const prompt = await db.collection("prompts").findOne({ _id: new ObjectId(id) });

    if (!prompt) return res.status(404).json({ message: "Prompt not found" });

    const isAdmin = user.role === "admin";
    const isOwner = prompt.creatorId === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    const updates = { ...req.body };
    delete updates._id;

    // If owner modifies prompt, reset status to pending
    if (isOwner && !isAdmin) {
      updates.status = "pending";
      delete updates.featured; // Owners can't feature their own prompts
    }

    const result = await db.collection("prompts").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deletePrompt = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    const db = getDatabase();
    const email = req.decoded.email;

    const user = await db.collection("users").findOne({ email });
    const prompt = await db.collection("prompts").findOne({ _id: new ObjectId(id) });

    if (!prompt) return res.status(404).json({ message: "Prompt not found" });

    const isAdmin = user.role === "admin";
    const isOwner = prompt.creatorId === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    const result = await db.collection("prompts").deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
