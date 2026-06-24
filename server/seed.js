import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

const predefinedPrompts = [
  // Engineering
  {
    title: "Senior React Developer Interview Simulator",
    description: "Acts as a technical interviewer asking advanced questions on React hooks, fiber architecture, and performance optimization.",
    promptText: "You are an expert technical interviewer for a Senior Frontend React Developer role. Ask me one senior-level React question at a time. Wait for my answer, critique it, and score it out of 10 before asking the next question. Start by asking me about React Fiber.",
    category: "Engineering",
    tool: "ChatGPT",
    level: "Advanced",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
  },
  {
    title: "AWS Infrastructure as Code (Terraform)",
    description: "Generates production-ready Terraform modules for scalable AWS architectures following best practices.",
    promptText: "Act as an AWS Solutions Architect. Write Terraform code to deploy a highly available VPC with public and private subnets, an Auto Scaling group of EC2 instances, an Application Load Balancer, and a Multi-AZ RDS instance. Include security groups.",
    category: "Engineering",
    tool: "Claude",
    level: "Pro",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
  },
  {
    title: "SQL Query Optimizer & Explainer",
    description: "Analyzes slow database queries, explains execution plans, and provides optimized index recommendations.",
    promptText: "Analyze the following slow SQL query. Explain why it is slow, suggest indexes to improve its performance, and rewrite the query using best practices: [INSERT QUERY HERE]",
    category: "Data",
    tool: "Gemini",
    level: "Intermediate",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80"
  },
  {
    title: "Cybersecurity Vulnerability Scanner",
    description: "Guides you through OWASP Top 10 security audits for your web applications with actionable fixes.",
    promptText: "Act as a Senior AppSec Engineer. I will provide a code snippet. You must analyze it for OWASP Top 10 vulnerabilities, specifically checking for SQLi, XSS, CSRF, and broken access control. Provide patched code.",
    category: "Engineering",
    tool: "ChatGPT",
    level: "Advanced",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
  },
  {
    title: "React Native UI Animation Expert",
    description: "Provides Reanimated 3 snippets for complex, 60fps gesture-driven mobile app animations.",
    promptText: "Write a React Native component using React Native Reanimated 3 that creates a smooth bottom sheet swipeable modal that interpolates background opacity based on the pan gesture translationY.",
    category: "Engineering",
    tool: "Claude",
    level: "Advanced",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80"
  },

  // Marketing & SEO
  {
    title: "High-Converting Landing Page Copywriter",
    description: "Generates PAS (Problem-Agitation-Solution) structured copy tailored for SaaS landing pages.",
    promptText: "Write landing page copy using the Problem-Agitation-Solution framework for a SaaS product that helps freelancers track their time. Include a catchy H1, 3 pain points, 3 feature benefits, and a strong CTA.",
    category: "Marketing",
    tool: "Claude",
    level: "Intermediate",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    title: "Viral TikTok Script Writer",
    description: "Generates high-retention 60-second video scripts with hooks, visual cues, and CTAs tailored for Gen Z.",
    promptText: "Write a highly engaging, 60-second TikTok script about [TOPIC]. Include a 3-second hook to stop the scroll, suggest specific visual B-roll or text overlays, and end with a cliffhanger or a strong call to action.",
    category: "Marketing",
    tool: "ChatGPT",
    level: "Beginner",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80"
  },
  {
    title: "SEO Pillar Page Content Strategy",
    description: "Creates comprehensive topic clusters and pillar page outlines to dominate search rankings.",
    promptText: "Act as an SEO expert. Create a pillar page strategy for the keyword '[KEYWORD]'. Provide 1 main pillar page outline with H2/H3 tags, and suggest 5 related cluster topics with target long-tail keywords for each.",
    category: "SEO",
    tool: "Gemini",
    level: "Advanced",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80"
  },
  {
    title: "Cold Email Outreach Sequence",
    description: "Drafts a 3-step cold email sequence tailored for B2B sales with high reply rates.",
    promptText: "Write a 3-step cold email sequence targeting [JOB TITLE] at [INDUSTRY] companies to sell [PRODUCT]. Email 1: Value proposition. Email 2: Case study/social proof. Email 3: Breakup email. Keep each under 150 words.",
    category: "Marketing",
    tool: "Claude",
    level: "Intermediate",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&q=80"
  },
  {
    title: "Google Ads Copy Generator",
    description: "Generates multiple variations of Google Ads headlines and descriptions optimized for CTR.",
    promptText: "Generate 5 Headline options (max 30 chars each) and 3 Description options (max 90 chars each) for a Google Ads campaign promoting a new AI writing tool. Focus on saving time and boosting creativity.",
    category: "Marketing",
    tool: "ChatGPT",
    level: "Beginner",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80"
  },

  // Design
  {
    title: "UX Persona & Journey Mapper",
    description: "Creates detailed user personas and empathy maps based on your target demographic inputs.",
    promptText: "Create a detailed UX User Persona for a [APP TYPE] application. Include Name, Age, Occupation, Frustrations, Goals, and a step-by-step User Journey Map showing their emotional state before, during, and after using the app.",
    category: "Design",
    tool: "ChatGPT",
    level: "Intermediate",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
  },
  {
    title: "Cyberpunk Cityscape Generator",
    description: "Highly detailed Midjourney prompt for creating stunning, neon-lit cyberpunk cityscapes.",
    promptText: "A futuristic cyberpunk city street at night, neon lights in pink and cyan, reflections in puddles, cinematic lighting, 8k resolution, photorealistic, intricate details, highly detailed, octane render, unreal engine 5 --ar 16:9 --v 5.2",
    category: "Design",
    tool: "Midjourney",
    level: "Beginner",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80"
  },
  {
    title: "Minimalist App Icon Design",
    description: "Stable Diffusion or Midjourney prompt for creating sleek, flat-design app icons.",
    promptText: "Flat vector logo of a [SUBJECT], minimalist, clean white background, vibrant gradient colors, dribbble style, iOS app icon style, simple shapes, 2D --v 5.0 --no text, 3d, realistic",
    category: "Design",
    tool: "Midjourney",
    level: "Intermediate",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
  },
  {
    title: "Email Newsletter Layout Generator",
    description: "Outputs responsive, accessible HTML/CSS templates for marketing emails that work across all clients.",
    promptText: "Generate the HTML and inline CSS for a responsive, dark-mode compatible email newsletter. Include a header with logo, a hero image section, two columns for articles, and a footer with social links. Must be table-based layout for Outlook compatibility.",
    category: "Design",
    tool: "Claude",
    level: "Pro",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&q=80"
  },
  {
    title: "Fantasy Character Concept Art",
    description: "Crafts prompts to generate incredibly detailed D&D style fantasy character portraits.",
    promptText: "Portrait of a fierce elven ranger, wearing intricate leather armor, glowing green eyes, holding an ornate bow, standing in an ancient glowing forest, fantasy concept art, by Greg Rutkowski, trending on ArtStation, 8k, highly detailed --ar 4:5 --q 2",
    category: "Design",
    tool: "Midjourney",
    level: "Advanced",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"
  },

  // Product & Data
  {
    title: "Product Requirements Document (PRD)",
    description: "Transforms rough feature ideas into structured PRDs ready for engineering estimation and agile sprints.",
    promptText: "Write a comprehensive Product Requirements Document (PRD) for a feature that [FEATURE DESCRIPTION]. Include sections for Background, Objectives, User Stories, Non-functional Requirements, Out of Scope, and success metrics.",
    category: "Product",
    tool: "ChatGPT",
    level: "Intermediate",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1507238692062-7f0ec689a7f3?w=800&q=80"
  },
  {
    title: "Agile Retrospective Facilitator",
    description: "Acts as an unbiased scrum master to guide your team through meaningful sprint retrospectives.",
    promptText: "Act as an Agile Scrum Master facilitating a retrospective. Ask me questions one by one using the 'Start, Stop, Continue' format. Don't provide the answers. Wait for my input for each category before moving to the next.",
    category: "Product",
    tool: "Claude",
    level: "Advanced",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&q=80"
  },
  {
    title: "Machine Learning Model Tuner",
    description: "Advises on hyperparameter tuning and model selection for various scikit-learn and TensorFlow setups.",
    promptText: "I am building a Random Forest Classifier for an imbalanced dataset with 1 million rows. What are the best strategies for handling the imbalance, and which hyperparameters should I tune first using GridSearchCV to avoid overfitting?",
    category: "Data",
    tool: "ChatGPT",
    level: "Pro",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80"
  },
  {
    title: "Data Visualization Strategist",
    description: "Recommends the best chart types and D3/Chart.js structures for complex datasets.",
    promptText: "I have a dataset containing [DATA DESCRIPTION]. I want to show [GOAL]. Recommend the top 3 best types of charts to visualize this. For the best option, provide the configuration object for Chart.js.",
    category: "Data",
    tool: "Gemini",
    level: "Intermediate",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  },
  {
    title: "Competitor Feature Matrix",
    description: "Generates a structured comparative analysis grid of your top 3 competitors in any SaaS niche.",
    promptText: "Create a feature comparison matrix table for the top 3 competitors in the [INDUSTRY/NICHE] space. Compare them across Pricing, Core Features, Integrations, and Target Audience. Then summarize the 'whitespace' opportunity.",
    category: "Product",
    tool: "Claude",
    level: "Beginner",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
  },

  // Education & Copywriting
  {
    title: "Socratic Method Tutor",
    description: "Teaches complex subjects by exclusively asking thought-provoking questions, never giving direct answers.",
    promptText: "Act as a Socratic tutor. You must never give me the direct answer to my questions. Instead, ask me guiding questions to help me arrive at the answer myself. We will learn about [SUBJECT]. Start by assessing my current knowledge.",
    category: "Education",
    tool: "ChatGPT",
    level: "Advanced",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80"
  },
  {
    title: "Feynman Technique Explainer",
    description: "Explains incredibly complex concepts so simply that a 12-year-old could easily understand them.",
    promptText: "Use the Feynman technique to explain [COMPLEX TOPIC]. Use simple language, everyday analogies, and clear structure. Avoid any jargon. If you must use a technical term, define it immediately using a simple analogy.",
    category: "Education",
    tool: "Claude",
    level: "Beginner",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
  },
  {
    title: "SEO Blog Post Writer",
    description: "Writes engaging, 1500+ word blog posts optimized for search intent and readability.",
    promptText: "Write a 1500-word SEO-optimized blog post about '[TOPIC]'. Include a catchy H1, short engaging introduction, at least five H2 sections, bullet points, and a conclusion. Target keyword density should be natural. Write in a conversational, authoritative tone.",
    category: "Copywriting",
    tool: "Gemini",
    level: "Intermediate",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead2708?w=800&q=80"
  },
  {
    title: "Brand Voice Harmonizer",
    description: "Rewrites any generic text to match your specific brand guidelines, tone, and vocabulary.",
    promptText: "Rewrite the following generic text to match a brand voice that is: [TONE TRAITS e.g. playful, professional, witty, empathetic]. Use shorter sentences and active voice. Here is the text: [INSERT TEXT]",
    category: "Copywriting",
    tool: "ChatGPT",
    level: "Advanced",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f6f5b4?w=800&q=80"
  },
  {
    title: "Language Immersion Roleplay",
    description: "Practices conversational skills in any language acting as a local native speaker in various scenarios.",
    promptText: "Act as a native [LANGUAGE] speaker working as a barista in [CITY]. I am a tourist trying to order coffee. Respond only in [LANGUAGE], keep it conversational, and correct any grammatical mistakes I make in English afterward.",
    category: "Education",
    tool: "Claude",
    level: "Intermediate",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80"
  }
];

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
    
    // Clear existing prompts
    await db.collection("prompts").deleteMany({});
    console.log("Cleared existing prompts");
    
    const prompts = [];
    
    // Map over predefined prompts and inject random creator data & random stats
    predefinedPrompts.forEach((template, index) => {
      // Pick a random user to be the creator
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      prompts.push({
        ...template,
        price: template.isPremium ? (Math.floor(Math.random() * 3) + 2) * 5 : 0, // $10, $15, $20 etc
        copies: Math.floor(Math.random() * 4000) + 100,
        views: Math.floor(Math.random() * 15000) + 500,
        rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
        creatorId: randomUser._id.toString(),
        creatorName: randomUser.name,
        creatorImage: randomUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(randomUser.name || "User")}`,
        tags: [template.tool, template.category, template.level],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        updatedAt: new Date()
      });
    });

    // Also add a few completely randomized ones to reach 30 prompts total (we have 25 predefined)
    const extraCategories = ["Engineering", "Marketing", "Design", "Education", "SEO"];
    const extraTools = ["ChatGPT", "Claude", "Gemini"];
    const extraLevels = ["Beginner", "Intermediate", "Advanced"];

    for (let i = 0; i < 5; i++) {
        const category = extraCategories[Math.floor(Math.random() * extraCategories.length)];
        const tool = extraTools[Math.floor(Math.random() * extraTools.length)];
        const level = extraLevels[Math.floor(Math.random() * extraLevels.length)];
        const isPremium = Math.random() > 0.5;
        const randomUser = users[Math.floor(Math.random() * users.length)];

        prompts.push({
            title: `Advanced ${category} Workflow using ${tool}`,
            description: `A powerful prompt for maximizing productivity in ${category} tasks using AI.`,
            promptText: `Act as a senior ${category} specialist. I need you to...`,
            category,
            tool,
            level,
            isPremium,
            price: isPremium ? 10 : 0,
            image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop", // Default AI abstract image
            copies: Math.floor(Math.random() * 1000),
            views: Math.floor(Math.random() * 5000),
            rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
            creatorId: randomUser._id.toString(),
            creatorName: randomUser.name,
            creatorImage: randomUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(randomUser.name || "User")}`,
            tags: [tool, category, level],
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    
    await db.collection("prompts").insertMany(prompts);
    console.log(`Successfully inserted ${prompts.length} realistic prompts with unique images!`);
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
