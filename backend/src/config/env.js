// backend/src/config/env.js
const dotenv = require('dotenv');

// Load .env file into process.env
dotenv.config();

// --- Helper: Fail if a required variable is undefined or empty ---
function ensureEnv(key) {
  const raw = process.env[key];

  if (raw === undefined) {
    console.error(`❌ FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }

  const trimmed = raw.trim();
  if (!trimmed || trimmed.length === 0) {
    console.error(`❌ FATAL: Environment variable ${key} is defined but EMPTY`);
    process.exit(1);
  }

  return trimmed;
}

// --- Critical backend environment variables ---
const requiredVars = ["MONGO_URI", "JWT_SECRET"];
requiredVars.forEach(ensureEnv);

// --- Export structured configuration object ---
module.exports = {
  // Server
  PORT: process.env.PORT ? process.env.PORT.trim() : 5000,
  NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "development",

  // Database — Works for MongoDB Atlas
  MONGO_URI: ensureEnv("MONGO_URI"),

  // Auth
  JWT_SECRET: ensureEnv("JWT_SECRET"),
  JWT_EXPIRE: process.env.JWT_EXPIRE
    ? process.env.JWT_EXPIRE.trim()
    : "30d",

  // Frontend CORS
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.trim()
    : "http://localhost:5173",

  // Redis (Phase 9)
  REDIS_URL: process.env.REDIS_URL
    ? process.env.REDIS_URL.trim()
    : "redis://127.0.0.1:6379",

  // ⭐ NEW — AI SERVICE URL (added for Phase 3)
  AI_SERVICE_URL: process.env.AI_SERVICE_URL
    ? process.env.AI_SERVICE_URL.trim()
    : "http://localhost:8000",
};

