const parseOrigins = (value) => {
  if (!value) {
    return ["http://localhost:3000"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN),
  mongodbUri: process.env.MONGODB_URI || "",
  databaseName: process.env.DB_NAME || "cognix",
};
