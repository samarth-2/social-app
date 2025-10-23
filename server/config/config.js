const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const baseEnvPath = path.resolve(process.cwd(), ".env");
const env = process.env.NODE_ENV;

if (fs.existsSync(baseEnvPath)) {
  dotenv.config({ path: baseEnvPath });
  console.log("Loaded base .env file");
} else if (env) {
  const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log(`Loaded .env.${env} file`);
  }
} else {
  console.warn("No .env file found and NODE_ENV not set");
}

const parseOrigins = (originsString) => {
  if (!originsString) return [];
  return originsString
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
};

const config = {
  env: env || "dev",
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  ALLOWED_ORIGINS: parseOrigins(process.env.CORS_ORIGINS),
};

module.exports = config;