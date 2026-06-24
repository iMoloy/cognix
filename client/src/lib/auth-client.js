import { createAuthClient } from "better-auth/react";

// In browser: use current origin so auth requests go through Next.js rewrite proxy
// In SSR: use backend URL directly
const getBase = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_API_URL || "https://cognix-6lqn.onrender.com";
};

export const authClient = createAuthClient({
  baseURL: `${getBase()}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
});
