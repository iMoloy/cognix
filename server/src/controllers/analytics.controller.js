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
      const paymentsCollection = db.collection("payments");

      const totalUsers = await usersCollection.countDocuments();
      const totalPrompts = await promptsCollection.countDocuments();
      const totalReviews = await reviewsCollection.countDocuments();

      // Get global total copies
      const copiesAggregation = await promptsCollection.aggregate([
        { $group: { _id: null, totalCopies: { $sum: "$copies" } } }
      ]).toArray();
      const totalCopies = copiesAggregation[0]?.totalCopies || 0;

      // AGGREGATION: Real Stripe Payments Revenue + Prompt Sales
      const stripeRevenueAgg = await paymentsCollection.aggregate([
        { $match: { status: "succeeded" } },
        { $group: { _id: null, stripeTotal: { $sum: "$amount" } } }
      ]).toArray();
      const stripeTotal = (stripeRevenueAgg[0]?.stripeTotal || 0) / 100;

      const promptSalesAgg = await promptsCollection.aggregate([
        { $group: { _id: null, promptTotal: { $sum: { $multiply: [{ $ifNull: ["$copies", 0] }, { $ifNull: ["$price", 0] }] } } } }
      ]).toArray();
      const promptTotal = promptSalesAgg[0]?.promptTotal || 0;

      const totalRevenue = parseFloat((stripeTotal + promptTotal).toFixed(2));

      // AGGREGATION: Real Daily Platform Activity (Last 7 dates with activity)
      const promptActivity = await promptsCollection.aggregate([
        { $match: { createdAt: { $exists: true } } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
            prompts: { $sum: 1 }
        }},
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]).toArray();

      const userActivity = await usersCollection.aggregate([
        { $match: { createdAt: { $exists: true } } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
            users: { $sum: 1 }
        }}
      ]).toArray();

      const reviewActivity = await reviewsCollection.aggregate([
        { $match: { createdAt: { $exists: true } } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
            reviews: { $sum: 1 }
        }}
      ]).toArray();

      // Create a map by date
      const userMap = new Map(userActivity.map(u => [u._id, u.users]));
      const reviewMap = new Map(reviewActivity.map(r => [r._id, r.reviews]));

      // Merge into activity dataset ordered chronologically
      let platformActivityData = promptActivity.reverse().map(item => ({
        name: item._id,
        users: userMap.get(item._id) || 0,
        prompts: item.prompts,
        reviews: reviewMap.get(item._id) || 0
      }));

      if (platformActivityData.length === 0) {
        platformActivityData = [{ name: new Date().toISOString().split('T')[0], users: totalUsers, prompts: totalPrompts, reviews: totalReviews }];
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
