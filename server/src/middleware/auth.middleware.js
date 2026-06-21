import jwt from "jsonwebtoken";

// Middleware to verify JWT Token
export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = req.headers.authorization.split(" ")[1];
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

import User from "../models/user.model.js";

// Middleware to verify Admin
export const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await User.findOne({ email });
  const isAdmin = user?.role === "admin";
  
  if (!isAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

// Middleware to verify Creator or Admin
export const verifyCreator = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await User.findOne({ email });
  const isCreatorOrAdmin = user?.role === "creator" || user?.role === "admin";
  
  if (!isCreatorOrAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};
