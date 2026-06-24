# Cognix Server (Express.js API)

This is the backend API server for the Cognix AI Prompt Sharing & Marketplace Platform, powered by Express.js and MongoDB.

## 🚀 API Endpoint Documentation

### 🔓 Public Endpoints
- `GET /api/prompts` - Retrieve approved marketplace prompts. Supports pagination, sorting (Most Copied, Highest Rated, Newest), search queries (includes tags), and filtering (Category, AI Engine, Difficulty).
- `GET /api/prompts/:id` - Get details of a single prompt by its ID (including user reviews).
- `POST /api/prompts/:id/copy` - Increment copy count metric for a prompt.

### 🛡️ Authentication Endpoints (Better Auth)
- `/api/auth/*` - Full authentication suite managed by Better Auth (Sign in, Sign up, Session, Google OAuth, etc.).
- `GET /api/users/:email` - Get details of a registered user by email.
- `PATCH /api/users/:email` - Update user profile information.
- `POST /api/users/bookmark` - Toggle bookmarking for a specific prompt ID.
- `GET /api/users/bookmarks/:email` - Retrieve all bookmarked prompts.
- `GET /api/users/dashboard-stats/:email` - Fetch dynamic stats (unlocked prompts, saved prompts, total spend) and recent activity for the user's dashboard overview.

### 🎨 Creator Endpoints (Creators/Admins)
- `GET /api/prompts/creator/:id` - Fetch all prompts created by a specific creator.
- `POST /api/prompts` - Create a new prompt (strictly limited to 3 prompts for free users).

### 👮 Admin Endpoints (Admins Only)
- `GET /api/prompts/admin/all` - Fetch all prompts in the system for review (pending, approved, rejected).
- `GET /api/users` - Fetch a paginated table list of registered users.
- `PATCH /api/users/role/:id` - Update a user's role (User, Creator, Admin).
- `DELETE /api/users/:id` - Terminate a user account (NOTE: Master Admin account is strictly protected and cannot be deleted).
- `GET /api/reports` - Fetch reported prompts moderation list.
- `POST /api/reports/:id/warn` - Warn prompt creator (increments warnings count on creator, logs warning details, and removes report from queue).
- `DELETE /api/reports/:id` - Dismiss / delete a report record.
- `GET /api/payments/all` - Fetch all platform transactions.
- `GET /api/analytics` - Fetch platform-wide analytics stats (Total Users, Total Prompts, Total Reviews, Total Copies, and platform revenue details computed via MongoDB aggregation).

### 💳 Stripe Endpoints
- `POST /api/payments/create-intent` - Generates a secure Stripe Payment Intent client secret for Premium upgrades.
- `POST /api/payments/success` - Validates successful Stripe checkout and upgrades user to Premium.

## 🛠️ Security Enforcements

- **`Better Auth Rate Limiting`**: Built-in brute force protection and request throttling.
- **`Master Admin Protection`**: API middleware strictly prevents deletion of the master account.
- **`verifyToken`**: Validates JWT session tokens.
- **`verifyCreator`**: Validates that user has "creator" or "admin" clearance.
- **`verifyAdmin`**: Restricts routes exclusively to users possessing the "admin" role.

## ⚙️ Environment Variables

Create a `.env` file in the root of the `server` directory:

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

## 💻 Getting Started

Run the following commands inside the `server` directory:

```bash
# Install dependencies
npm install

# Seed initial demonstration database
npm run seed (if seed.js is present)

# Start API server in watch mode
npm run dev
```
The API server will listen on `http://localhost:5000` by default.
