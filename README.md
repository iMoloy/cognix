# Cognix — AI Prompt Sharing & Marketplace Platform

Cognix is a premium, feature-rich web application designed for prompt engineers, creators, and AI enthusiasts to discover, publish, bookmark, review, and monetize high-quality AI prompts for popular engines like ChatGPT, Claude, Gemini, and Midjourney.

---

## 🚀 Key Features

### 🔍 Search & Filtering (Marketplace)
- **Advanced Search**: Search for prompts by Title, Description, or Tags. Secure search query design prevents unpublished/pending prompts from leaking.
- **Category & Engine Filters**: Filter by categories (Engineering, Marketing, Design, Product, etc.) and AI Engines.
- **Difficulty Level Filter**: Filter prompts by **Difficulty** (Beginner, Intermediate, Pro) with complete URL parameter synchronization.

### 🛡️ Access Control & Security
- **Client-Side Auth Guards**: Secure client-side routing on all Admin routes (`/dashboard/admin/users`, `/dashboard/admin/reports`, `/dashboard/admin/payments`, `/dashboard/admin/prompts`). Non-admins or unauthenticated users are automatically redirected to the `/login` page.
- **JWT & Firebase Authentication**: Role-based access control (User, Creator, Admin) enforced on both client and server.

### ⚠️ Community Moderation & "Warn Creator"
- **Report System**: Users can report prompts violating marketplace guidelines with details.
- **Admin Moderation Queue**: Admins can dismiss reports, remove prompts, or **Warn the Creator** (which increments the creator's warning count, logs the warning reason, and resolves the report).

### 📊 Dynamic User & Admin Dashboards
- **Dynamic Stats Overview**: The user dashboard renders live database statistics:
  - **Unlocked Prompts**: Total prompts accessible based on subscription state.
  - **Saved to Library**: Count of bookmarks.
  - **Total Spend**: Total money spent on premium subscriptions.
  - **Recent Activity**: Renders live lists of the latest approved prompts on the platform.
- **Advanced Admin Analytics**: Tracks global registered users, platform prompts, total copies count (calculated via MongoDB aggregation), total reviews, and platform revenue.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication + Custom JWT Validation
- **Payments**: Stripe SDK (Payment Intents API)

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
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Client Configuration (`client/.env.local`)
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Image Upload (ImgBB)
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
