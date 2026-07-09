<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:0a1628,100:0f2a1e&height=180&section=header&text=Cognix&fontSize=50&fontColor=ffffff&fontAlignY=38&desc=AI%20Prompt%20Sharing%20%26%20Marketplace%20Platform&descAlignY=58&descSize=17&descColor=4ade80&animation=fadeIn" width="100%" alt="Cognix banner" />

  [![Live App](https://img.shields.io/badge/🌐%20Live%20App-cognix--client.vercel.app-4ade80?style=for-the-badge&logo=vercel&logoColor=white)](https://cognix-client.vercel.app)
  [![GitHub](https://img.shields.io/badge/GitHub-iMoloy%2Fcognix-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/iMoloy/cognix)

</div>

---

## 📖 Overview

**Cognix** is a premium, full-stack AI prompt sharing and marketplace platform for prompt engineers, creators, and AI enthusiasts. Users can discover, publish, bookmark, review, and monetize high-quality AI prompts for engines like **ChatGPT, Claude, Gemini, and Midjourney** — backed by Stripe payments, Better Auth, and MongoDB.

> **Live at** → [https://cognix-client.vercel.app](https://cognix-client.vercel.app)

---

## 🛠️ Technologies Used

### Frontend (client)

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) (App Router) | React framework |
| [React](https://react.dev/) | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Recharts](https://recharts.org/) | Admin analytics charts |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | Toast notifications |
| [React Quill New](https://github.com/suren-atoyan/react-quill) | Rich text / Markdown rendering |
| [Stripe React Elements](https://stripe.com/docs/stripe-js/react) | Payment checkout UI |
| [html-to-image](https://github.com/bubkoo/html-to-image) + [jsPDF](https://github.com/parallax/jsPDF) | PDF export |

### Backend (server)

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express.js](https://expressjs.com/) | HTTP server |
| [MongoDB](https://www.mongodb.com/) | Database |
| [Better Auth](https://www.better-auth.com/) | JWT + Google OAuth authentication |
| [Stripe SDK](https://stripe.com/docs/api) | Payment Intents API |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | Brute-force protection |

---

## ✨ Core Features

### 🔍 Search & Discovery
- **Global Dynamic Search** — Real-time search across Hero, Marketplace, Top Creators, and Admin Dashboards
- **Category & Engine Filters** — Filter by AI engine (ChatGPT, Claude, Gemini, Midjourney) and domain category
- **Difficulty Filter** — Beginner / Intermediate / Pro with URL parameter sync
- **Trending Algorithm** — MongoDB aggregation combining copies + ratings for ranking
- **Infinite Scroll** — Smooth feed browsing without page-based pagination

### 🛡️ Security & Auth
- **Better Auth** — Google OAuth with automatic account linking and JWT-based role control
- **Rate Limiting** — Global and per-route brute-force protection
- **Role-Based Access** — User, Creator, and Admin roles enforced on client and server
- **Master Admin Protection** — Server-side guard prevents master admin deletion

### 💳 Monetization
- **Pro Builder Subscription** — Stripe Elements checkout for premium tier upgrade
- **Transaction Logs** — Admin-level paginated Stripe payment history

### 📊 Dashboards
- **User Dashboard** — Live stats: Unlocked Prompts, Library, Spend, Activity
- **Admin Analytics** — Global users, prompts, copies, reviews, and revenue
- **Community Moderation** — Report queue with Warn Creator, dismiss, and remove actions

### ✨ Additional
- **PDF Export** — Download prompt details as PDF
- **Prompt Forking** — "Copy to Edit" for building on existing prompts
- **Global Error Boundary** — Custom `error.jsx` prevents crashes on bad routing

---

## 📦 Dependencies

### client/package.json (key deps)

| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Core framework |
| `better-auth` | Authentication client |
| `@stripe/react-stripe-js`, `@stripe/stripe-js` | Stripe payment UI |
| `recharts` | Admin charts |
| `framer-motion` | Animations |
| `react-quill-new` | Rich text editor |
| `html-to-image`, `jspdf` | PDF export |
| `react-toastify` | Notifications |
| `tailwindcss` | Styling |

### server/package.json (key deps)

| Package | Purpose |
|---|---|
| `express` | HTTP server |
| `mongoose` | MongoDB ODM |
| `better-auth` | Auth engine |
| `stripe` | Payments |
| `express-rate-limit` | Brute-force protection |
| `cors`, `dotenv` | Cross-origin and env config |

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** v20.6 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account

---

### 1 — Clone the repository

```bash
git clone https://github.com/iMoloy/cognix.git
cd cognix
```

---

### 2 — Backend Server Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
DB_NAME=cognix_db

BETTER_AUTH_SECRET=your_super_secret_auth_key
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the server:

```bash
npm run dev
```

> Runs on **http://localhost:5000**

---

### 3 — Frontend Client Setup

```bash
cd ../client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start the client:

```bash
npm run dev
```

> Runs on **http://localhost:3000**

---

### Available Scripts (root workspace)

| Command | Description |
|---|---|
| `npm run dev:client` | Start Next.js frontend |
| `npm run dev:server` | Start Express backend |
| `npm run build:client` | Build production frontend |

---

## 🔗 Resources

- 🌐 **Live App** → [https://cognix-client.vercel.app](https://cognix-client.vercel.app)
- 🐙 **GitHub** → [github.com/iMoloy/cognix](https://github.com/iMoloy/cognix)
- 💼 **Author** → [linkedin.com/in/iMoloy](https://linkedin.com/in/iMoloy)

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2a1e,50:0a1628,100:0d1117&height=100&section=footer&animation=fadeIn" width="100%" alt="Footer" />
  <sub>Made with ❤️ by <strong>Moloy Krishna Paul</strong></sub>
</div>
