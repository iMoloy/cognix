import { getDatabase } from "../db/client.js";

export const getAnalytics = async (req, res) => {
  try {
    const { creatorId } = req.query;
    const db = getDatabase();

    // If creatorId is provided, fetch stats for that specific creator
    if (creatorId) {
      // Creator Analytics
      const promptsCollection = db.collection("prompts");
      
      const creatorPrompts = await promptsCollection.find({ creatorId }).toArray();
      const totalPrompts = creatorPrompts.length;
      
      const totalCopies = creatorPrompts.reduce((acc, prompt) => acc + (prompt.copies || 0), 0);
      
      // Mocking bookmarks since we don't have a saved_prompts collection yet
      const totalBookmarks = Math.floor(totalCopies * 0.3);

      // Generate prompt growth data (mocking the timeline based on total prompts)
      // Since we don't have robust timestamps on all old seed data, we will mock the growth curve based on actual counts
      const promptGrowthData = [
        { name: 'Mon', prompts: Math.floor(totalPrompts * 0.1) },
        { name: 'Tue', prompts: Math.floor(totalPrompts * 0.2) },
        { name: 'Wed', prompts: Math.floor(totalPrompts * 0.35) },
        { name: 'Thu', prompts: Math.floor(totalPrompts * 0.5) },
        { name: 'Fri', prompts: Math.floor(totalPrompts * 0.7) },
        { name: 'Sat', prompts: Math.floor(totalPrompts * 0.85) },
        { name: 'Sun', prompts: totalPrompts },
      ];

      return res.status(200).json({
        totalPrompts,
        totalCopies,
        totalBookmarks,
        promptGrowthData
      });

    } else {
      // Admin Analytics (Global)
      const usersCollection = db.collection("users");
      const promptsCollection = db.collection("prompts");

      const totalUsers = await usersCollection.countDocuments();
      const totalPrompts = await promptsCollection.countDocuments();

      // Calculate global revenue (sum of copies * price)
      const allPrompts = await promptsCollection.find().toArray();
      const totalRevenue = allPrompts.reduce((acc, prompt) => {
        const copies = prompt.copies || 0;
        const price = prompt.price || 0;
        return acc + (copies * price);
      }, 0);

      // Mock platform activity data for BarChart since we lack historical timestamps
      const platformActivityData = [
        { name: 'Week 1', users: Math.floor(totalUsers * 0.1), prompts: Math.floor(totalPrompts * 0.15), reviews: 30 },
        { name: 'Week 2', users: Math.floor(totalUsers * 0.25), prompts: Math.floor(totalPrompts * 0.3), reviews: 65 },
        { name: 'Week 3', users: Math.floor(totalUsers * 0.6), prompts: Math.floor(totalPrompts * 0.6), reviews: 110 },
        { name: 'Week 4', users: Math.floor(totalUsers * 0.05), prompts: Math.floor(totalPrompts * 0.05), reviews: 40 }, // current week
      ];

      return res.status(200).json({
        totalUsers,
        totalPrompts,
        totalRevenue,
        platformActivityData
      });
    }

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};
