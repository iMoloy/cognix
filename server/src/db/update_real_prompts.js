import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DB_NAME || "cognix_db";

const REAL_PROMPT_CATALOG = {
  Engineering: [
    {
      title: "Senior Next.js 14 & React App Architect",
      description: "Acts as a Principal React Architect helping you build production-ready Next.js 14 App Router applications with TypeScript, Server Components, and optimal caching.",
      instruction: "Act as a Principal Frontend Engineer specializing in Next.js 14 App Router, TypeScript, and React Server Components.\n\nYour task is to analyze the user's feature requirement or code snippet and provide:\n1. Architectural breakdown (Server vs Client Components decision)\n2. Production-grade TypeScript implementation using best practices\n3. Data fetching & revalidation strategy (Server Actions, React Cache, revalidatePath)\n4. Performance & bundle size optimization advice\n\nPlease provide clean code with error handling and types. What feature are we building?",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      tags: ["nextjs", "react", "typescript", "architecture", "frontend"],
      level: "Advanced",
    },
    {
      title: "AWS Infrastructure as Code (Terraform & HCL)",
      description: "Generates production-ready Terraform HCL modules for scalable, highly available AWS cloud infrastructure following AWS Well-Architected Framework.",
      instruction: "Act as an AWS Principal Cloud Solutions Architect.\n\nProvide modular, production-ready Terraform (HCL) code for the specified AWS infrastructure requirement.\n\nStructure your response with:\n- `main.tf`: Core resource definitions\n- `variables.tf`: Configurable parameters with validations\n- `outputs.tf`: Useful resource exports\n- Security Group & IAM least-privilege policy setup\n\nRequirement: [Specify AWS architecture, e.g., Multi-AZ VPC with ECS Fargate and Aurora PostgreSQL]",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      tags: ["aws", "terraform", "devops", "cloud", "infrastructure"],
      level: "Pro",
    },
    {
      title: "Cybersecurity Vulnerability & OWASP Auditor",
      description: "Analyzes application code for OWASP Top 10 vulnerabilities, SQL injection, XSS, CSRF, and broken access controls with patched code recommendations.",
      instruction: "Act as a Senior Application Security (AppSec) Auditor. Review the provided source code against OWASP Top 10 vulnerabilities.\n\nFor every vulnerability identified, provide:\n1. Vulnerability Name & Severity Level (Critical, High, Medium, Low)\n2. CWE / OWASP ID\n3. Root Cause Analysis (why it is exploitable)\n4. Patched, secure replacement code\n5. Recommended security headers or mitigation strategies\n\nCode snippet: [Insert Code Here]",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
      tags: ["security", "owasp", "cybersecurity", "code-audit", "patch"],
      level: "Advanced",
    },
    {
      title: "Async FastAPI & Python Microservice Backend",
      description: "Designs scalable async FastAPI services with SQLModel/SQLAlchemy 2.0, JWT authentication, and Pydantic v2 schemas.",
      instruction: "Act as a Senior Python Backend Engineer specializing in FastAPI and AsyncIO.\n\nWrite a clean, modular FastAPI router including:\n1. Pydantic v2 request/response validation models\n2. Async database session management with SQLAlchemy 2.0\n3. OAuth2 JWT authentication middleware\n4. Structured JSON logging and custom exception handlers\n\nFeature request: [Describe API endpoint requirement]",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      tags: ["python", "fastapi", "backend", "api", "asyncio"],
      level: "Intermediate",
    },
    {
      title: "Docker Multi-Stage Build & Security Hardening",
      description: "Optimizes Dockerfiles for minimal container size (<100MB), non-root execution, vulnerability scanning, and multi-architecture builds.",
      instruction: "Act as a DevOps Containerization Specialist.\n\nOptimize the provided Dockerfile or project runtime for containerization. Ensure:\n1. Multi-stage build process to minimize final image size\n2. Execution as non-root user for security compliance\n3. Optimal layer caching strategy for dependencies\n4. Healthcheck directive and SIGTERM signal handling\n\nEnvironment details: [Specify application stack, e.g. Node.js / Go / Python]",
      image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
      tags: ["docker", "devops", "containers", "security", "ci-cd"],
      level: "Intermediate",
    },
    {
      title: "React Native Reanimated 3 Mobile UI Animations",
      description: "Provides React Native Reanimated 3 & Gesture Handler snippets for 60fps gesture-driven mobile app animations and native components.",
      instruction: "Act as a Senior Mobile Developer specializing in React Native, Expo, and Reanimated 3.\n\nWrite a performant, 60fps fluid UI component with touch gestures.\nRequirements:\n- Clean TypeScript code\n- Smooth gesture handling using React Native Gesture Handler v2\n- Worklet-based animations via Reanimated 3\n- iOS & Android compatibility\n\nComponent request: [e.g., Swipeable Bottom Sheet with Backdrop Blur]",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      tags: ["react-native", "mobile", "expo", "animation", "ios"],
      level: "Advanced",
    },
    {
      title: "Idiomatic Golang Microservice REST API Architecture",
      description: "Generates clean Go microservices with Chi/Gin router, Clean Architecture layers (Domain/Repository/Handler), and unit tests.",
      instruction: "Act as a Senior Go Developer. Create an idiomatic Go service following Clean Architecture principles.\nInclude:\n1. Domain entities & repository interfaces\n2. HTTP handlers using `net/http` or Chi router\n3. Middleware for logging, CORS, and recovery\n4. Unit tests using standard `testing` package and `testify`\n\nService domain: [Insert feature, e.g., Payment Webhook Handler]",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      tags: ["golang", "go", "microservices", "clean-architecture", "backend"],
      level: "Advanced",
    },
    {
      title: "PostgreSQL Schema Design & EXPLAIN ANALYZE Tuning",
      description: "Analyzes slow database queries, designs normalized schemas, and provides optimal BTREE and Partial index recommendations.",
      instruction: "Act as a Senior Database Administrator (DBA).\n\nAnalyze the provided SQL schema or slow query log and provide:\n1. Optimized query rewrite using EXPLAIN ANALYZE insights\n2. Index recommendations (BTREE, GIN, Partial indexes)\n3. Schema normalization or partitioning strategy\n4. Deadlock prevention and concurrency advice\n\nSQL query: [Insert query or schema here]",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
      tags: ["postgresql", "database", "sql", "performance", "optimization"],
      level: "Pro",
    }
  ],

  Marketing: [
    {
      title: "High-Converting SaaS Landing Page Copywriter (PAS)",
      description: "Generates PAS (Problem-Agitation-Solution) structured copy tailored for SaaS landing pages with high-converting CTAs.",
      instruction: "Act as a World-Class SaaS Copywriter. Write landing page copy using the Problem-Agitation-Solution (PAS) framework.\n\nOutput structure:\n1. Attention-Grabbing Hero Headline (H1) & Subheadline\n2. Pain Points & Agitation section\n3. Solution Presentation & Feature-Benefit bullets\n4. Social Proof / Testimonial framing\n5. High-converting Call To Action (CTA) buttons\n\nProduct info: [Insert Product Name & Main Benefit]",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      tags: ["copywriting", "saas", "landing-page", "marketing", "conversion"],
      level: "Intermediate",
    },
    {
      title: "Viral TikTok & Instagram Reels Script Writer",
      description: "Creates high-retention 60-second video scripts with visual B-roll cues, text overlays, and scroll-stopping hooks.",
      instruction: "Act as a Viral Short-Form Content Strategist for TikTok and Instagram Reels.\n\nWrite a 60-second script designed for maximum watch time and engagement.\n\nStructure:\n- 0-3s: Scroll-stopping hook (visual + verbal)\n- 4-15s: Problem statement / curiosity builder\n- 16-45s: Core value delivery / step-by-step payoff\n- 46-60s: Strong CTA & engagement prompt\nInclude explicit B-roll directions and text overlay instructions.\n\nTopic: [Insert Topic]",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
      tags: ["tiktok", "reels", "video-script", "viral", "social-media"],
      level: "Beginner",
    },
    {
      title: "SEO Topic Cluster & Keyword Map Strategist",
      description: "Builds topical authority content maps with pillar pages, sub-topic clusters, internal linking maps, and search intent analysis.",
      instruction: "Act as a Senior SEO Content Strategist.\n\nCreate a comprehensive Topic Cluster Content Strategy for the given niche.\n\nProvide:\n1. Core Pillar Page topic & target primary keyword\n2. 8 Sub-topic cluster articles categorized by Search Intent (Informational, Transactional, Commercial)\n3. Recommended internal linking anchor text mapping\n4. Meta title and meta description formulas\n\nNiche / Industry: [Insert Niche Here]",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["seo", "content-strategy", "keywords", "organic-traffic", "marketing"],
      level: "Advanced",
    },
    {
      title: "Enterprise B2B Cold Email Cadence (4-Step)",
      description: "Drafts hyper-personalized B2B sales email sequences designed for high open rates (40%+) and meeting booking conversions.",
      instruction: "Act as a B2B Enterprise Sales Outreach Expert.\n\nDraft a 4-step cold email cadence aimed at Decision Makers (VP / C-Level).\n\nEmails to include:\n- Email 1: The Soft Pitch (Relevance + Specific Pain Point + Low Friction CTA)\n- Email 2: The Case Study / Value Add\n- Email 3: Quick Bump / Nuanced Question\n- Email 4: Breakup Email with lasting value\n\nTarget ICP & Service: [Insert Target Role and Value Proposition]",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      tags: ["b2b", "cold-email", "sales", "outreach", "copywriting"],
      level: "Intermediate",
    },
    {
      title: "LinkedIn Thought Leadership & Engagement Generator",
      description: "Transforms raw industry insights into formatted LinkedIn posts engineered for viral reach, comments, and personal brand growth.",
      instruction: "Act as a Top 1% LinkedIn Content Creator.\n\nRewrite the following raw insight into a high-performing LinkedIn post.\n\nGuidelines:\n- Hook in the first 2 lines (visible before 'see more')\n- Short, punchy paragraphs with line breaks\n- Actionable takeaways or framework\n- Engaging closing question to drive comments\n- 3 relevant hashtags\n\nRaw insight/topic: [Insert Topic or Bullet Points]",
      image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&q=80",
      tags: ["linkedin", "personal-brand", "thought-leadership", "content", "social"],
      level: "Beginner",
    }
  ],

  Design: [
    {
      title: "Photorealistic Cinematic Portrait Prompt (Midjourney v6)",
      description: "Generates 8K ultra-detailed photorealistic portrait prompts with lighting, lens specs, camera angles, and rendering flags.",
      instruction: "Act as an Expert Midjourney Prompt Engineer.\n\nGenerate 3 distinct, highly detailed Midjourney v6 prompts based on the subject description.\n\nInclude camera parameters, lighting setup (e.g., volumetric lighting, Rembrandt lighting, 85mm f/1.4 lens, Hasselblad H6D), color grade, depth of field, and parameter flags (--ar 16:9 --style raw --v 6.0 --q 2).\n\nSubject description: [Insert Character or Subject]",
      image: "https://images.unsplash.com/photo-1507238692062-7f0ec689a7f3?w=800&q=80",
      tags: ["midjourney", "photorealism", "portrait", "ai-art", "prompt-engineering"],
      level: "Advanced",
    },
    {
      title: "Minimalist Vector Logo & Brand Identity Prompt",
      description: "Crafts vector icon and minimalist logo prompts for Midjourney and DALL-E 3 with clean geometry and isolated solid backgrounds.",
      instruction: "Act as a Principal Brand Identity Designer.\n\nCreate detailed image generation prompts for a modern startup logo.\n\nPrompt requirements:\n- Style: Minimalist flat vector design, clean geometry, golden ratio proportions\n- Background: Isolated on pure solid white background\n- Parameters: No shading, high contrast, clean vector graphics, --no realistic photorealistic gradients\n\nBrand Name & Concept: [Insert Startup Name and Core Concept]",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
      tags: ["logo", "branding", "midjourney", "vector", "design"],
      level: "Intermediate",
    },
    {
      title: "Futuristic Cyberpunk Sci-Fi 3D Environment (Midjourney)",
      description: "Creates breathtaking 3D environment art prompts featuring neon lighting, rain reflections, and futuristic architecture.",
      instruction: "Act as a Senior Concept Artist for AAA sci-fi video games.\n\nDraft an immersive Midjourney prompt for a futuristic city concept visual.\n\nInclude:\n- Atmosphere: Neon glow, volumetric fog, wet asphalt reflections, holographic billboards\n- Architectural style: Cyberpunk brutalism meets high-tech mega-structures\n- Aspect ratio flag `--ar 21:9` and styling parameters\n\nEnvironment theme: [Specify setting, e.g., Futuristic Tokyo Alleyway at Night]",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      tags: ["cyberpunk", "sci-fi", "concept-art", "environment", "midjourney"],
      level: "Advanced",
    },
    {
      title: "Modern Dark Mode SaaS Dashboard UI/UX Architect",
      description: "Generates UI component ideas, color palettes, micro-interactions, and Figma layout structure for modern dark-themed web apps.",
      instruction: "Act as a Lead Product UI/UX Designer.\n\nDesign the layout, typography hierarchy, component breakdown, and design token system for a modern dark-mode dashboard.\n\nDeliverables:\n1. Color Palette (HSL background, glassmorphism card fill, vibrant accent colors)\n2. Layout Grid structure & navigation sidebar\n3. Key UI widgets and data visualization charts\n4. Micro-interaction and hover state specs\n\nApp type: [Insert App Concept, e.g. AI Financial Analytics Dashboard]",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      tags: ["ui-ux", "figma", "dashboard", "design-system", "dark-mode"],
      level: "Pro",
    },
    {
      title: "3D Isometric Studio Room Render (Blender Style)",
      description: "Creates detailed isometric 3D render prompts for Blender-style miniature rooms with warm interior lighting.",
      instruction: "Act as a 3D Architectural Visualizer.\n\nDraft a detailed prompt for generating an isometric 3D render of a stylized room.\n\nSpecify:\n- Isometric angle view, low-poly 3D aesthetic, Octane render style\n- Cozy lighting (warm sunset rays through window, soft ambient light)\n- Detailed interior items (bookshelves, desk setup, plants, RGB lighting)\n\nRoom concept: [Insert room concept, e.g., Software Developer Workspace]",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      tags: ["3d", "isometric", "blender", "octane", "midjourney"],
      level: "Intermediate",
    }
  ],

  Data: [
    {
      title: "Python Pandas Data Cleaning & EDA Pipeline",
      description: "Generates robust Python Pandas scripts for cleaning missing values, detecting outliers, and producing exploratory data analysis (EDA).",
      instruction: "Act as a Lead Data Scientist.\n\nWrite a modular Python script using Pandas, NumPy, and Seaborn for Exploratory Data Analysis (EDA).\n\nInclude:\n1. Data cleaning (handling missing values, type casting, duplicate removal)\n2. Outlier detection using IQR method\n3. Statistical summary and correlation matrix heatmaps\n4. Visualizations saved as high-res PNG files\n\nDataset description: [Describe CSV/Data Schema]",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["python", "pandas", "data-science", "eda", "analytics"],
      level: "Intermediate",
    },
    {
      title: "XGBoost Machine Learning Pipeline & Hyperparameter Tuning",
      description: "Writes scikit-learn & XGBoost pipelines with cross-validation, hyperparameter tuning via Optuna, and evaluation metrics.",
      instruction: "Act as an Applied Machine Learning Engineer.\n\nWrite an end-to-end Python ML model pipeline using XGBoost and scikit-learn.\n\nInclude:\n1. ColumnTransformer for feature encoding and scaling\n2. Train/Test split with stratification\n3. Optuna hyperparameter optimization loop\n4. Model evaluation (ROC-AUC, F1-Score, Confusion Matrix plot)\n\nProblem type & target: [Specify classification or regression problem]",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
      tags: ["machine-learning", "xgboost", "python", "optuna", "ai"],
      level: "Advanced",
    },
    {
      title: "Financial DCF Valuation & Financial Ratio Model",
      description: "Performs Discounted Cash Flow (DCF) valuation, WACC calculation, and financial ratio breakdown for public and private companies.",
      instruction: "Act as a Senior Investment Banking Analyst.\n\nPerform a financial valuation analysis based on the provided company financials.\n\nOutput requirements:\n1. Discounted Cash Flow (DCF) model setup with terminal value calculation\n2. WACC (Weighted Average Cost of Capital) estimation\n3. Key Financial Ratios (ROE, ROIC, Debt/EBITDA, Free Cash Flow Margin)\n4. Sensitivity Analysis Matrix (WACC vs Perpetual Growth Rate)\n\nCompany Financial Data: [Insert Revenue, FCF, Debt, Equity metrics]",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      tags: ["finance", "valuation", "dcf", "excel", "analytics"],
      level: "Pro",
    },
    {
      title: "Apache Airflow ETL Pipeline DAG Generator",
      description: "Creates production Airflow DAGs with custom PythonOperators, PostgresOperators, task retries, and Slack alerts.",
      instruction: "Act as a Data Engineer.\n\nWrite an Apache Airflow DAG in Python that implements a robust ETL workflow.\n\nRequirements:\n- Daily scheduled execution with `catchup=False`\n- Task 1: Extract data from API endpoint\n- Task 2: Transform and validate schema using Pydantic\n- Task 3: Load into PostgreSQL data warehouse\n- On failure callback sending Slack webhook notifications\n\nPipeline details: [Insert Data Source and Destination]",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      tags: ["airflow", "etl", "data-engineering", "python", "postgres"],
      level: "Advanced",
    }
  ],

  Product: [
    {
      title: "Product Requirements Document (PRD) Specialist",
      description: "Transforms rough feature ideas into structured PRDs with executive summary, user stories, technical dependencies, and success metrics.",
      instruction: "Act as a Principal Product Manager.\n\nCreate a detailed Product Requirements Document (PRD) for the proposed feature.\n\nStructure:\n1. Executive Summary & Problem Statement\n2. Goals & Key Performance Indicators (KPIs)\n3. User Stories with Detailed Acceptance Criteria (Gherkin syntax: Given/When/Then)\n4. Out of Scope items\n5. Technical & Security Considerations\n\nFeature Idea: [Insert Feature Idea]",
      image: "https://images.unsplash.com/photo-1507238692062-7f0ec689a7f3?w=800&q=80",
      tags: ["prd", "product-management", "agile", "user-stories", "strategy"],
      level: "Intermediate",
    },
    {
      title: "User Persona & Customer Journey Map Generator",
      description: "Builds multi-dimensional customer personas with goals, frustrations, buying triggers, and stage-by-stage journey touchpoints.",
      instruction: "Act as a Senior UX Researcher.\n\nDevelop 2 comprehensive User Personas and a Customer Journey Map for the specified product.\n\nInclude per persona:\n- Demographics, Role, and Daily Workflow\n- Primary Goals & Pain Points\n- Decision Triggers & Objections\n- Customer Journey Map (Awareness -> Consideration -> Purchase -> Retention)\n\nProduct type: [Insert Product or Service Concept]",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
      tags: ["ux-research", "user-persona", "customer-journey", "product", "design"],
      level: "Intermediate",
    },
    {
      title: "SaaS Competitor Analysis & Feature Matrix",
      description: "Generates detailed competitive landscape matrix, SWOT analysis, and positioning strategy against market incumbents.",
      instruction: "Act as a Product Strategy Consultant.\n\nConduct a competitive analysis for a new market entrant against top 3 established competitors.\n\nDeliverables:\n1. Feature Comparison Matrix (Table format)\n2. Competitor Pricing Model breakdown\n3. SWOT Analysis for our product\n4. Recommended Value Proposition & Differentiation Strategy\n\nProduct & Competitors: [Insert your product and main competitors]",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      tags: ["competitor-analysis", "swot", "product-strategy", "saas", "market-research"],
      level: "Advanced",
    }
  ]
};

// Normalize tools and categories
const normalizeTool = (tool) => {
  if (!tool) return "ChatGPT";
  const t = tool.trim().toLowerCase();
  if (t.includes("midjourney")) return "Midjourney";
  if (t.includes("claude")) return "Claude";
  if (t.includes("gemini")) return "Gemini";
  if (t.includes("dall")) return "DALL-E";
  if (t.includes("deepseek")) return "DeepSeek";
  return "ChatGPT";
};

const normalizeCategory = (cat) => {
  if (!cat) return "Engineering";
  const c = cat.trim().toLowerCase();
  if (c.includes("engine")) return "Engineering";
  if (c.includes("market")) return "Marketing";
  if (c.includes("desig")) return "Design";
  if (c.includes("data")) return "Data";
  if (c.includes("prod")) return "Product";
  return "Engineering";
};

async function updatePromptsInMongo() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const promptsCollection = db.collection("prompts");

    const prompts = await promptsCollection.find({}).toArray();
    console.log(`Found ${prompts.length} prompts to update in database.`);

    let updatedCount = 0;
    const categoryCounters = {
      Engineering: 0,
      Marketing: 0,
      Design: 0,
      Data: 0,
      Product: 0
    };

    for (const prompt of prompts) {
      const category = normalizeCategory(prompt.category);
      const tool = normalizeTool(prompt.tool);
      
      const catalog = REAL_PROMPT_CATALOG[category] || REAL_PROMPT_CATALOG.Engineering;
      const index = categoryCounters[category] % catalog.length;
      categoryCounters[category]++;

      const template = catalog[index];

      // If title is already custom (not Admin's / Creator's / User's / Fork of / Test), keep title but enhance description & instruction
      let isGenericTitle = !prompt.title || 
        prompt.title.includes("Admin's Pro Prompt") || 
        prompt.title.includes("Creator's Pro Prompt") || 
        prompt.title.includes("User's Pro Prompt") || 
        prompt.title.includes("Moloy") || 
        prompt.title.startsWith("Test") || 
        prompt.title.startsWith("Fork of") || 
        prompt.title.length < 5;

      const newTitle = isGenericTitle ? template.title : prompt.title;
      const newDescription = (prompt.description && prompt.description.length > 40 && !isGenericTitle)
        ? prompt.description
        : template.description;
      const newInstruction = template.instruction;

      const updatePayload = {
        title: newTitle,
        description: newDescription,
        instruction: newInstruction,
        promptText: newInstruction, // sync promptText
        category: category,
        tool: tool,
        level: prompt.level || prompt.difficulty || template.level,
        difficulty: prompt.level || prompt.difficulty || template.level,
        image: template.image,
        tags: template.tags,
        status: "approved"
      };

      await promptsCollection.updateOne(
        { _id: prompt._id },
        { $set: updatePayload }
      );

      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} prompts with real dynamic content and images!`);

  } catch (error) {
    console.error("Error updating prompts:", error);
  } finally {
    await client.close();
  }
}

updatePromptsInMongo();
