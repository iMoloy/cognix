# Cognix — AI Prompt Sharing & Marketplace Platform

Cognix is a premium, feature-rich web application designed for prompt engineers, creators, and AI enthusiasts to discover, publish, bookmark, review, and monetize high-quality AI prompts for popular engines like ChatGPT, Claude, Gemini, and Midjourney.

- **GitHub Repository**: [https://github.com/iMoloy/cognix](https://github.com/iMoloy/cognix)
- **Live Deployment Link**: [https://cognix-client.vercel.app](https://cognix-client.vercel.app)

---

## 🚀 Key Features

### 🔍 Advanced Search & Dynamic Filtering
- **Global Dynamic Search**: Search functionality is implemented across the platform (Hero Section, Prompts Marketplace, Top Creators, and Admin Dashboards) updating in real-time.
- **Top Creators Directory**: Dedicated page to find creators, sortable by "Most Copies", "Highest Rating", and "Most Prompts", with a unified UI filter design.
- **Category & Engine Filters**: Filter by categories (Engineering, Marketing, Design, Product, etc.) and AI Engines.
- **Difficulty Level Filter**: Filter prompts by **Difficulty** (Beginner, Intermediate, Pro) with complete URL parameter synchronization.

### 🛡️ Access Control, Security & Robustness
- **Better Auth Integration**: Highly secure authentication system featuring full Google OAuth integration with automatic account linking.
- **Brute Force Protection**: Global and route-specific Rate Limiting implemented directly to mitigate high-velocity credential stuffing attacks.
- **Master Admin Protection**: Strict server-side router protections guarantee that the Master Admin account can never be deleted from the system.
- **Global Error Handling**: Custom `error.jsx` boundary ensures the app never crashes on page reloads or invalid routing, displaying a beautiful UI fallback instead.
- **Client-Side Auth Guards**: Secure client-side routing on all Admin routes (`/dashboard/admin/*`). Non-admins or unauthenticated users are automatically redirected to the `/login` page.
- **JWT Validation**: Role-based access control (User, Creator, Admin) enforced on both client and server via robust JWT validation.

### ⚠️ Community Moderation & "Warn Creator"
- **Report System**: Users can report prompts violating marketplace guidelines with detailed reasoning.
- **Admin Moderation Queue**: Admins can dismiss reports, remove prompts, or **Warn the Creator** (which increments the creator's warning count, logs the warning reason, and resolves the report).

### 💳 Premium Monetization & Stripe
- **Pro Builder Subscription**: Users can upgrade to a premium tier via a beautifully customized Stripe Elements checkout that perfectly matches the dark/emerald UI of the website.
- **Transaction Logs**: Admins can view and track paginated Stripe transaction logs.

### 📊 Dynamic User & Admin Dashboards
- **Dynamic Stats Overview**: The user dashboard renders live database statistics (Unlocked Prompts, Saved to Library, Total Spend, Recent Activity).
- **Intelligent Pagination**: Dynamic pagination across Admin tables (Payments, Reports, Users) that elegantly hides controls when data sets are small.
- **Advanced Admin Analytics**: Tracks global registered users, platform prompts, total copies count (calculated via MongoDB aggregation), total reviews, and platform revenue.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Better Auth (JWT, OAuth)
- **Payments**: Stripe SDK (Payment Intents API & React Stripe Elements)

---

## ⚙️ Environment Setup

Ensure you create the configuration files in their respective folders:

### 1. Server Configuration (`server/.env`)
Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
DB_NAME=cognix_db

# Better Auth Configuration
BETTER_AUTH_SECRET=your_super_secret_auth_key
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Stripe Config
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Client Configuration (`client/.env.local`)
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# ImgBB API (Image upload)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 💻 Running the Project Locally

### 1. Run Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Run Frontend Client
```bash
cd client
npm install
npm run dev
```
The application will open on `http://localhost:3000`.
