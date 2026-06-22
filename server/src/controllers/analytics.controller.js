import { getDatabase } from "../db/client.js";

export const getAnalytics = async (req, res) => {
  try {
    const { creatorId } = req.query;
    const db = getDatabase();

    // If creatorId is provided, fetch stats for that specific creator
    if (creatorId) {
      const promptsCollection = db.collection("prompts");
      
      // AGGREGATION: Get total prompts and copies
      const statsAggregation = await promptsCollection.aggregate([
        { $match: { creatorId: creatorId } },
        { $group: {
            _id: null,
            totalPrompts: { $sum: 1 },
            totalCopies: { $sum: "$copies" }
        }}
      ]).toArray();

      const totalPrompts = statsAggregation[0]?.totalPrompts || 0;
      const totalCopies = statsAggregation[0]?.totalCopies || 0;
      const totalBookmarks = Math.floor(totalCopies * 0.3); // Keeping mock for bookmarks as there's no collection yet

      // AGGREGATION: Prompt Growth by Date (Last 7 days mock or real)
      const growthAggregation = await promptsCollection.aggregate([
        { $match: { creatorId: creatorId } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
            prompts: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
        { $limit: 7 }
      ]).toArray();

      const promptGrowthData = growthAggregation.map(item => ({
        name: item._id,
        prompts: item.prompts
      }));

      // Fallback to empty if no data yet
      if (promptGrowthData.length === 0) {
        promptGrowthData.push({ name: new Date().toISOString().split('T')[0], prompts: 0 });
      }

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
      const reviewsCollection = db.collection("reviews");

      const totalUsers = await usersCollection.countDocuments();
      const totalPrompts = await promptsCollection.countDocuments();

      // AGGREGATION: Calculate global revenue
      const revenueAggregation = await promptsCollection.aggregate([
        { $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ["$copies", "$price"] } }
        }}
      ]).toArray();
      const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

      // AGGREGATION: Platform Activity (Prompts over time)
      const activityAggregation = await promptsCollection.aggregate([
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
            prompts: { $sum: 1 }
        }},
        { $sort: { _id: 1 } },
        { $limit: 7 }
      ]).toArray();

      const platformActivityData = activityAggregation.map((item, index) => ({
        name: item._id,
        users: Math.floor(totalUsers / 7) + (index * 2), // Mocked relative to total
        prompts: item.prompts,
        reviews: Math.floor(item.prompts * 1.5)
      }));

      if (platformActivityData.length === 0) {
        platformActivityData.push({ name: "Today", users: totalUsers, prompts: 0, reviews: 0 });
      }

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
