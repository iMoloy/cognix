import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
  const user = req.body;
  if (!user || !user.email) {
    return res.status(400).send({ message: "Invalid payload" });
  }
  
  // Generate JWT Token
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  
  res.send({ token });
});

export default router;
