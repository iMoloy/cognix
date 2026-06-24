import { auth } from "../auth/auth.js";
import { getDatabase } from "../db/client.js";

// Middleware to verify Better Auth Session
export const verifyToken = async (req, res, next) => {
  try {
    const sessionData = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!sessionData || !sessionData.session) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    // Attach user and session to request
    req.decoded = sessionData.user;
    req.session = sessionData.session;
    next();
  } catch (err) {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

// Middleware to verify Admin
export const verifyAdmin = async (req, res, next) => {
  if (!req.decoded) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  
  const email = req.decoded.email;
  const db = getDatabase();
  const user = await db.collection("users").findOne({ email });
  const isAdmin = user?.role === "admin";
  
  if (!isAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

// Middleware to verify Creator or Admin
export const verifyCreator = async (req, res, next) => {
  if (!req.decoded) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const email = req.decoded.email;
  const db = getDatabase();
  const user = await db.collection("users").findOne({ email });
  const isCreatorOrAdmin = user?.role === "creator" || user?.role === "admin";
  
  if (!isCreatorOrAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};
