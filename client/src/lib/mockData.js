export const mockPrompts = [
  {
    _id: "1",
    title: "Senior React Developer Interview Simulator",
    description: "Acts as a technical interviewer asking advanced questions on React hooks, fiber architecture, and performance optimization.",
    instruction: "You are an expert technical interviewer. Ask me one senior-level React question at a time. Wait for my answer, critique it, and score it out of 10 before asking the next question.",
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
    createdAt: "Oct 12, 2026",
    reviews: [
      { id: 1, user: "Sarah K.", rating: 5, text: "Incredible prompt. It really grilled me on React Server Components!", date: "2 days ago" },
    ]
  },
  {
    _id: "2",
    title: "High-Converting Landing Page Copywriter",
    description: "Generates PAS (Problem-Agitation-Solution) structured copy tailored for SaaS landing pages with strong CTAs.",
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
    createdAt: "Nov 01, 2026",
    reviews: []
  },
  {
    _id: "3",
    title: "SQL Query Optimizer & Explainer",
    description: "Analyzes slow database queries, explains execution plans, and provides optimized index recommendations.",
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
    createdAt: "Oct 25, 2026",
    reviews: []
  },
  {
    _id: "4",
    title: "Product Requirements Document (PRD)",
    description: "Transforms rough feature ideas into structured PRDs ready for engineering estimation and agile sprints.",
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
    createdAt: "Oct 15, 2026",
    reviews: []
  },
  {
    _id: "5",
    title: "AWS Infrastructure as Code (Terraform)",
    description: "Generates production-ready Terraform modules for scalable AWS architectures following best practices.",
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
    createdAt: "Sep 20, 2026",
    reviews: []
  },
  {
    _id: "6",
    title: "UX Persona & Journey Mapper",
    description: "Creates detailed user personas and empathy maps based on your target demographic inputs.",
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
    createdAt: "Nov 05, 2026",
    reviews: []
  },
  {
    _id: "7",
    title: "Cybersecurity Vulnerability Scanner",
    description: "Guides you through OWASP Top 10 security audits for your web applications with actionable fixes.",
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
    createdAt: "Oct 10, 2026",
    reviews: []
  },
  {
    _id: "8",
    title: "Viral TikTok Script Writer",
    description: "Generates high-retention 60-second video scripts with hooks, visual cues, and CTAs tailored for Gen Z.",
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
    createdAt: "Aug 15, 2026",
    reviews: []
  },
  {
    _id: "9",
    title: "Machine Learning Model Tuner",
    description: "Advises on hyperparameter tuning and model selection for various scikit-learn and TensorFlow setups.",
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
    createdAt: "Jul 22, 2026",
    reviews: []
  },
  {
    _id: "10",
    title: "Email Newsletter Layout Generator",
    description: "Outputs responsive, accessible HTML/CSS templates for marketing emails that work across all clients.",
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
    createdAt: "Sep 01, 2026",
    reviews: []
  },
  {
    _id: "11",
    title: "Agile Retrospective Facilitator",
    description: "Acts as an unbiased scrum master to guide your team through meaningful sprint retrospectives.",
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
    createdAt: "Oct 05, 2026",
    reviews: []
  },
  {
    _id: "12",
    title: "React Native UI Animation Expert",
    description: "Provides Reanimated 3 snippets for complex, 60fps gesture-driven mobile app animations.",
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
    createdAt: "Nov 10, 2026",
    reviews: []
  }
];
