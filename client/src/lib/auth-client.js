import { createAuthClient } from "better-auth/react";

// In production on Vercel, Next.js rewrites /api/* → Render backend (same-origin → cookies work!)
// In development, use localhost:5000 directly
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";

export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
});
