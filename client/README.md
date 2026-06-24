# Cognix Client (Next.js Application)

This is the frontend client for the Cognix AI Prompt Sharing & Marketplace Platform, built with Next.js 14 (App Router).

## 🚀 Key Client Features

- **Dynamic Navigation & Dashboard Shell**: Responsive side navigation with dynamic links dependent on the user's role (User, Creator, Admin).
- **Client Auth Guards**: Active check for Admin role on routing `/dashboard/admin/*` to automatically redirect unauthenticated or standard users.
- **Advanced Dynamic Search & Filters**: Interactive UI for global searching and filtering across the Hero Section, Top Creators directory, Prompts Marketplace, and Admin Tables. Real-time updates and URL parameter syncing.
- **Intelligent Pagination**: Dynamic pagination controls embedded natively in Admin tables for managing large volumes of Users, Reports, and Payments.
- **Interactive Modals**: Includes review submission rating/comment modal, prompt reporting modal with reasons, and rejection feedback modal.
- **Premium Responsive UI**: Tablet-optimized mobile menus with high-end grid layouts, glassmorphism styling, and dynamic auth-based button positioning.
- **Global Error Boundaries**: Custom `error.jsx` fallback UI to gracefully handle rendering errors and deep-link reloads without application crashes.
- **Premium Stripe Integration**: Highly customized Checkout form utilizing Stripe Payment Elements, heavily tailored via the Appearance API to match the platform's dark/emerald UI aesthetic perfectly.
- **Analytics Visualizations**: Real-time charts using Recharts library showing Creator growth metrics and Admin platform activity statistics.

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Auth Service**: Better Auth Client SDK
- **Payments**: @stripe/react-stripe-js

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

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
