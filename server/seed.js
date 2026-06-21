import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Get all users
    const users = await db.collection("users").find({}).toArray();
    console.log(`Found ${users.length} users in ${dbName}`);
    
    if (users.length === 0) {
      console.log("No users found. Please register some users first.");
      return;
    }
    
    // Categories and tools for random data
    const categories = ["Engineering", "Marketing", "Design", "Education", "SEO", "Copywriting"];
    const tools = ["ChatGPT", "Claude", "Gemini", "Midjourney"];
    const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Pro"];
    
    // Clear existing prompts
    await db.collection("prompts").deleteMany({});
    console.log("Cleared existing prompts");
    
    const prompts = [];
    
    // Generate 5 prompts for each user
    users.forEach((user, index) => {
      for (let i = 0; i < 5; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const tool = tools[Math.floor(Math.random() * tools.length)];
        const level = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
        const isPremium = Math.random() > 0.6; // 40% chance of premium
        
        prompts.push({
          title: `${tool} ${category} Prompt ${i + 1} by ${user.name || "Creator"}`,
          description: `An amazing ${level} level prompt for ${category} using ${tool}. This prompt helps you achieve great results quickly.`,
          promptText: isPremium ? "" : `Act as a ${category} expert. Please do the following...`,
          category,
          tool,
          level,
          isPremium,
          price: isPremium ? 5 : 0,
          copies: Math.floor(Math.random() * 5000),
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
          creatorId: user._id.toString(), // Store as string for easy matching
          creatorName: user.name,
          creatorImage: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`,
          tags: [tool, category, level],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
          updatedAt: new Date()
        });
      }
    });
    
    await db.collection("prompts").insertMany(prompts);
    console.log(`Successfully inserted ${prompts.length} prompts`);
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
