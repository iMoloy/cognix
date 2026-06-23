# Cognix Client (Next.js Application)

This is the frontend client for the Cognix AI Prompt Sharing & Marketplace Platform, built with Next.js 14 (App Router).

## 🚀 Key Client Features

- **Dynamic Navigation & Dashboard Shell**: Responsive side navigation with dynamic links dependent on the user's role (User, Creator, Admin).
- **Client Auth Guards**: Active check for Admin role on routing `/dashboard/admin/*` to automatically redirect unauthenticated or standard users.
- **Marketplace Filters**: Interactive sidebar filters for categories, AI Engine tools, and **Difficulty level** (Beginner, Intermediate, Pro), fully synced in real-time with URL parameters.
- **Interactive Modals**: Includes review submission rating/comment modal, prompt reporting modal with reasons, and rejection feedback modal.
- **Stripe Integration**: Checkout form utilizing Stripe Payment Elements.
- **Analytics Visualizations**: Real-time charts using Recharts library showing Creator growth metrics and Admin platform activity statistics.

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Auth Service**: Firebase Client SDK

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ImgBB API (Image upload)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 💻 Getting Started

Run the following commands inside the `client` directory:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
