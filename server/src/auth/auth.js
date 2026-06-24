import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { database } from "../db/client.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL 
    ? process.env.BETTER_AUTH_URL 
    : "http://localhost:5000/api/auth",
  trustedOrigins: env.clientOrigins,
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production"
    }
  },
  database: mongodbAdapter(database, {
    usePlural: true
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
    }
  },
  secret: env.betterAuthSecret,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user"
      },
      subscription: {
        type: "string",
        required: false,
        defaultValue: "free"
      }
    }
  },
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds window
    max: 100, // global max 100 requests per minute per IP
    customRules: [
      {
        path: "/sign-in/email",
        window: 60,
        max: 5, // max 5 login attempts per minute per IP to prevent brute force
      }
    ]
  }
});
