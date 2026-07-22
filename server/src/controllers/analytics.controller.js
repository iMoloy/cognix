import { getDatabase } from "../db/client.js";

export const getAnalytics = async (req, res) => {
  try {
    const { creatorId } = req.query;
    const db = getDatabase();

    // If creatorId is provided, fetch stats for that specific creator
    if (creatorId) {
      const promptsCollection = db.collection("prompts");
      // AGGREGATION: Get total prompts, copies, and estimated earnings
      const statsAggregation = await promptsCollection.aggregate([
        { $match: { creatorId: creatorId } },
        { $group: {
            _id: null,
            totalPrompts: { $sum: 1 },
            totalCopies: { $sum: "$copies" },
            totalEarnings: { $sum: { $multiply: [{ $ifNull: ["$copies", 0] }, { $ifNull: ["$price", 0] }] } }
        }}
      ]).toArray();

      const totalPrompts = statsAggregation[0]?.totalPrompts || 0;
      const totalCopies = statsAggregation[0]?.totalCopies || 0;
      // Get creator's prompt IDs to count actual bookmarks
      const creatorPrompts = await promptsCollection.find({ creatorId }, { projection: { _id: 1 } }).toArray();
      const creatorPromptIds = creatorPrompts.map(p => p._id.toString());
      
      const bookmarksCollection = db.collection("bookmarks");
      const totalBookmarks = await bookmarksCollection.countDocuments({ promptId: { $in: creatorPromptIds } });

      // Creator earnings: 70% of their prompt sales (copies × price), platform takes 30%
      const CREATOR_REVENUE_SHARE = 0.7;
      const rawEarnings = statsAggregation[0]?.totalEarnings || 0;
      const totalEarnings = parseFloat((rawEarnings * CREATOR_REVENUE_SHARE).toFixed(2));

      // Per-prompt earnings breakdown (top 5 by earnings)
      const earningsBreakdown = await promptsCollection.aggregate([
        { $match: { creatorId: creatorId } },
        { $project: {
            title: 1,
            copies: { $ifNull: ["$copies", 0] },
            price: { $ifNull: ["$price", 0] },
            earnings: { $multiply: [
              { $ifNull: ["$copies", 0] },
              { $ifNull: ["$price", 0] },
              CREATOR_REVENUE_SHARE
            ]}
        }},
        { $sort: { earnings: -1 } },
        { $limit: 5 }
      ]).toArray();

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
        totalEarnings,
        earningsBreakdown,
        promptGrowthData
      });

    } else {
      // Admin Analytics (Global)
      const usersCollection = db.collection("users");
      const promptsCollection = db.collection("prompts");
      const reviewsCollection = db.collection("reviews");

      const totalUsers = await usersCollection.countDocuments();
      const totalPrompts = await promptsCollection.countDocuments();
      const totalReviews = await reviewsCollection.countDocuments();

      // Get global total copies
      const copiesAggregation = await promptsCollection.aggregate([
        { $group: { _id: null, totalCopies: { $sum: "$copies" } } }
      ]).toArray();
      const totalCopies = copiesAggregation[0]?.totalCopies || 0;

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
        totalReviews,
        totalCopies,
        totalRevenue,
        platformActivityData
      });
    }

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};
