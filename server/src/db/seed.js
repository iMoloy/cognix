import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "cognix_db";

const seedPrompts = [
  {
    title: "Senior React Developer Interview Simulator",
    description: "Acts as a technical interviewer asking advanced questions on React hooks, fiber architecture, and performance optimization.",
    instruction: "You are an expert technical interviewer. Ask me one senior-level React question at a time. Wait for my answer, critique it, and score it out of 10 before asking the next question. Focus on React 18 features, concurrency, and state management at scale.",
    category: "Engineering",
    tool: "ChatGPT",
    copies: 342,
    views: 1205,
    rating: 4.9,
    isPremium: true,
    price: 5,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    author: {
      name: "Alex Dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      role: "Senior Staff Engineer"
    },
    createdAt: new Date("2026-10-12"),
    reviews: [
      { id: 1, user: "Sarah K.", rating: 5, text: "Incredible prompt. It really grilled me on React Server Components!", date: "2 days ago" },
    ]
  },
  {
    title: "High-Converting Landing Page Copywriter",
    description: "Generates PAS (Problem-Agitation-Solution) structured copy tailored for SaaS landing pages with strong CTAs.",
    instruction: "I will provide my product features. Your job is to output a landing page copy using the PAS framework. Include a catchy headline, a subheadline, 3 pain points, 3 solutions with benefits, and 2 strong call-to-actions.",
    category: "Marketing",
    tool: "Claude",
    copies: 1205,
    views: 4500,
    rating: 4.7,
    isPremium: false,
    price: 0,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    author: {
      name: "Marketing Pro",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
      role: "Growth Hacker"
    },
    createdAt: new Date("2026-11-01"),
    reviews: []
  },
  {
    title: "SQL Query Optimizer & Explainer",
    description: "Analyzes slow database queries, explains execution plans, and provides optimized index recommendations.",
    instruction: "I will provide a slow SQL query and schema. You must: 1. Explain why it is slow. 2. Rewrite it for optimal performance. 3. Suggest necessary BTREE or compound indexes to support the new query.",
    category: "Data",
    tool: "Gemini",
    copies: 89,
    views: 320,
    rating: 5.0,
    isPremium: false,
    price: 0,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    author: {
      name: "Data Ninja",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Data",
      role: "Database Admin"
    },
    createdAt: new Date("2026-10-25"),
    reviews: []
  },
  {
    title: "Product Requirements Document (PRD)",
    description: "Transforms rough feature ideas into structured PRDs ready for engineering estimation and agile sprints.",
    instruction: "Create a comprehensive PRD based on my feature summary. Include: Executive Summary, Goals, User Stories (As a... I want to... So that...), Out of Scope, and Technical Dependencies.",
    category: "Product",
    tool: "ChatGPT",
    copies: 567,
    views: 2100,
    rating: 4.8,
    isPremium: true,
    price: 9,
    image: "https://images.unsplash.com/photo-1507238692062-7f0ec689a7f3?w=800&q=80",
    author: {
      name: "Product Jane",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      role: "PM Leader"
    },
    createdAt: new Date("2026-10-15"),
    reviews: []
  },
  {
    title: "AWS Infrastructure as Code (Terraform)",
    description: "Generates production-ready Terraform modules for scalable AWS architectures following best practices.",
    instruction: "Act as a Lead DevOps Engineer. I will describe an AWS architecture. You will output the complete Terraform HCL code spread across main.tf, variables.tf, and outputs.tf. Use official AWS modules where applicable.",
    category: "Engineering",
    tool: "Claude",
    copies: 210,
    views: 800,
    rating: 4.6,
    isPremium: true,
    price: 15,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    author: {
      name: "Cloud Architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cloud",
      role: "DevOps Specialist"
    },
    createdAt: new Date("2026-09-20"),
    reviews: []
  },
  {
    title: "UX Persona & Journey Mapper",
    description: "Creates detailed user personas and empathy maps based on your target demographic inputs.",
    instruction: "Given a product description and target demographic, create 2 distinct User Personas. For each persona, outline their Goals, Frustrations, Tech Literacy, and a 5-step User Journey Map for onboarding.",
    category: "Design",
    tool: "ChatGPT",
    copies: 840,
    views: 3100,
    rating: 4.9,
    isPremium: false,
    price: 0,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    author: {
      name: "UX Master",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=UX",
      role: "Lead Designer"
    },
    createdAt: new Date("2026-11-05"),
    reviews: []
  },
  {
    title: "Cybersecurity Vulnerability Scanner",
    description: "Guides you through OWASP Top 10 security audits for your web applications with actionable fixes.",
    instruction: "Act as a Penetration Tester. I will provide code snippets or architecture designs. You will identify vulnerabilities based on OWASP Top 10, explain the exploit vector, and provide the patched code.",
    category: "Engineering",
    tool: "ChatGPT",
    copies: 150,
    views: 500,
    rating: 4.5,
    isPremium: true,
    price: 12,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    author: {
      name: "SecOps Guru",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SecOps",
      role: "Security Engineer"
    },
    createdAt: new Date("2026-10-10"),
    reviews: []
  },
  {
    title: "Viral TikTok Script Writer",
    description: "Generates high-retention 60-second video scripts with hooks, visual cues, and CTAs tailored for Gen Z.",
    instruction: "Write a 60-second TikTok script. Column 1: Visual/Audio cues. Column 2: Dialogue. Must include a 3-second visual hook, fast-paced transitions, and an engagement-focused CTA at the end.",
    category: "Marketing",
    tool: "Gemini",
    copies: 3400,
    views: 12000,
    rating: 4.9,
    isPremium: false,
    price: 0,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    author: {
      name: "Social Star",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Star",
      role: "Content Creator"
    },
    createdAt: new Date("2026-08-15"),
    reviews: []
  },
  {
    title: "Machine Learning Model Tuner",
    description: "Advises on hyperparameter tuning and model selection for various scikit-learn and TensorFlow setups.",
    instruction: "I will provide my dataset characteristics and current ML model performance. You will suggest 3 alternative models, specific hyperparameters to tune via GridSearch, and potential data augmentation strategies.",
    category: "Data",
    tool: "Claude",
    copies: 412,
    views: 1500,
    rating: 4.7,
    isPremium: true,
    price: 8,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    author: {
      name: "AI Researcher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AI",
      role: "Data Scientist"
    },
    createdAt: new Date("2026-07-22"),
    reviews: []
  },
  {
    title: "Email Newsletter Layout Generator",
    description: "Outputs responsive, accessible HTML/CSS templates for marketing emails that work across all clients.",
    instruction: "Generate a table-based HTML email template that is responsive and works in Outlook, Gmail, and Apple Mail. Include inline CSS, a header image placeholder, a 2-column article section, and a footer.",
    category: "Design",
    tool: "ChatGPT",
    copies: 980,
    views: 4000,
    rating: 4.6,
    isPremium: false,
    price: 0,
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80",
    author: {
      name: "Email Wiz",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Email",
      role: "Frontend Dev"
    },
    createdAt: new Date("2026-09-01"),
    reviews: []
  },
  {
    title: "Agile Retrospective Facilitator",
    description: "Acts as an unbiased scrum master to guide your team through meaningful sprint retrospectives.",
    instruction: "Facilitate a Sprint Retrospective. Ask the team 3 questions sequentially: What went well? What didn't go well? What can we improve? Synthesize the answers into 3 actionable SMART goals.",
    category: "Product",
    tool: "Claude",
    copies: 620,
    views: 2200,
    rating: 4.8,
    isPremium: true,
    price: 4,
    image: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&q=80",
    author: {
      name: "Scrum Master",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Scrum",
      role: "Agile Coach"
    },
    createdAt: new Date("2026-10-05"),
    reviews: []
  },
  {
    title: "React Native UI Animation Expert",
    description: "Provides Reanimated 3 snippets for complex, 60fps gesture-driven mobile app animations.",
    instruction: "I will describe a UI interaction. You will write the React Native code using React Native Reanimated v3 and React Native Gesture Handler. Ensure the animations run on the UI thread for 60fps performance.",
    category: "Engineering",
    tool: "ChatGPT",
    copies: 310,
    views: 1100,
    rating: 5.0,
    isPremium: true,
    price: 10,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    author: {
      name: "Mobile Guru",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mobile",
      role: "App Developer"
    },
    createdAt: new Date("2026-11-10"),
    reviews: []
  },
  {
    title: "B2B Cold Email Sequence Builder",
    description: "Drafts a 4-part cold email outreach sequence designed to bypass spam filters and book meetings.",
    instruction: "Write a 4-step B2B cold email sequence for a SaaS product. Email 1: Value hook. Email 2: Case study. Email 3: Quick question. Email 4: Breakup. Keep all emails under 100 words and optimize for reply rates.",
    category: "Marketing",
    tool: "Claude",
    copies: 2500,
    views: 8900,
    rating: 4.8,
    isPremium: true,
    price: 19,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&q=80",
    author: {
      name: "Sales Closer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sales",
      role: "Account Executive"
    },
    createdAt: new Date("2026-08-30"),
    reviews: []
  },
  {
    title: "Python Data Scraper & Parser",
    description: "Generates robust BeautifulSoup and Playwright scripts for extracting data from dynamic websites.",
    instruction: "I will provide a target website structure and the data I need. You will write a Python script using Playwright for rendering JS and BeautifulSoup for parsing. Include error handling and polite rate limiting.",
    category: "Data",
    tool: "ChatGPT",
    copies: 540,
    views: 1800,
    rating: 4.7,
    isPremium: true,
    price: 7,
    image: "https://images.unsplash.com/photo-1526374865314-756e4e5bc062?w=800&q=80",
    author: {
      name: "Scraper Bot",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Scraper",
      role: "Data Engineer"
    },
    createdAt: new Date("2026-09-18"),
    reviews: []
  },
  {
    title: "SaaS Onboarding Flow Designer",
    description: "Designs step-by-step user onboarding flows focusing on time-to-value and reduced churn.",
    instruction: "I will describe my SaaS product. Outline a 4-step user onboarding flow. For each step, specify the UI modal copy, the action required from the user, and the psychological trigger used to motivate them.",
    category: "Design",
    tool: "Gemini",
    copies: 730,
    views: 2900,
    rating: 4.9,
    isPremium: false,
    price: 0,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    author: {
      name: "Growth Design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Growth",
      role: "Product Designer"
    },
    createdAt: new Date("2026-11-12"),
    reviews: []
  }
];

async function seedDatabase() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    
    console.log(`Connected to database: ${DATABASE_NAME}`);
    
    const promptsCollection = db.collection("prompts");
    
    // Clear existing prompts
    console.log("Dropping existing prompts...");
    await promptsCollection.deleteMany({});
    
    // Insert new prompts
    console.log(`Inserting ${seedPrompts.length} prompts...`);
    const result = await promptsCollection.insertMany(seedPrompts);
    
    console.log(`Successfully seeded ${result.insertedCount} prompts!`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seedDatabase();
