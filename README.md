# Cognix

Cognix is a premium AI prompt sharing and marketplace platform. It allows users to discover, publish, bookmark, review, and monetize high-quality AI prompts for tools like ChatGPT, Claude, Gemini, and Midjourney.

## Features

- **Prompt Marketplace**: Browse and search through a rich collection of public and premium prompts.
- **Premium Unlock**: Users can unlock premium prompts using Stripe.
- **Creator Dashboard**: Manage published prompts, track earnings, and respond to reviews.
- **Admin Dashboard**: Moderation tools to manage users, approve/reject prompts, and handle reports.
- **Social Features**: Bookmark favorites, leave ratings & reviews, and copy prompts to clipboard.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: Firebase Auth + JWT (Custom Claims)
- **Payments**: Stripe Checkout

## Environment Variables Setup

You will need to create two `.env` files based on the provided `.env.example` templates.

### 1. Server Setup (`server/.env`)

Create a `.env` file in the `server` directory and add the following keys:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=cognix
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Client Setup (`client/.env.local`)

Create a `.env.local` file in the `client` directory and add the following keys:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase Config (Get this from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ImgBB API Key (For image uploads)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Running the Application Locally

Run the following commands from the root directory to start the development servers:

```bash
# Start the backend server (runs on port 5000)
npm run dev:server

# Start the frontend Next.js app (runs on port 3000)
npm run dev:client
```

To build the client for production:
```bash
npm run build:client
```
