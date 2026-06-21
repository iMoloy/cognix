const jwt = require("jsonwebtoken");
const token = jwt.sign({ email: "test@cognix.com" }, "b7d34c1b9f8e2a6d5c4a7e9f3b2d1c8e5a6f4b3d2c1e9a8f7b6d5c4e3a2b1f0c", { expiresIn: "1h" });
console.log(token);
