import { getDatabase } from "../db/client.js";
import { ObjectId } from "mongodb";

export const getPrompts = async (req, res, next) => {
  try {
    const { search, category, tool, sort, page = 1, limit = 10 } = req.query;
    const db = getDatabase();
    
    // Build filter query
    const statusFilter = { $or: [{ status: "approved" }, { status: { $exists: false } }] };

    // Start with the status filter as base query
    const query = { ...statusFilter };

    if (search) {
      // Use $and to keep status filter AND apply search — prevents pending prompts from leaking
      query.$and = [
        statusFilter,
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $elemMatch: { $regex: search, $options: "i" } } },
          ]
        }
      ];
      delete query.$or;
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
    
    // Fetch reviews for this prompt
    const reviews = await db.collection("reviews").find({ promptId: id }).sort({ date: -1 }).toArray();
    prompt.reviews = reviews.map(r => ({
      id: r._id,
      user: r.userName || "User",
      rating: r.rating,
      text: r.comment
    }));

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
    
    // Enforcement: Free users can only add 3 prompts
    const email = req.decoded.email;
    const user = await db.collection("users").findOne({ email });
    
    if (user) {
      const isPremium = user.subscription === "premium" || user.role === "admin";
      if (!isPremium) {
        const promptCount = await db.collection("prompts").countDocuments({ creatorId: user._id.toString() });
        if (promptCount >= 3) {
          return res.status(403).json({ 
            message: "Free users can only add 3 prompts. Please upgrade to premium.",
            limitReached: true
          });
        }
      }
    }

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
      delete updates.rejectionReason; // Remove previous rejection reason
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
