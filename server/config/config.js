const path = require("path");
const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || "dev";
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const config = {
  env,
  PORT: process.env.PORT || 3000,
  MONGO_URL:process.env.MONGO_URL,
  JWT_SECRET:process.env.JWT_SECRET,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
};

module.exports = config;