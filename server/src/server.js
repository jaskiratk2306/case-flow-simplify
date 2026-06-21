import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes.js";
import prisma from "./lib/prisma.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Main API Router
app.use("/api", apiRouter);

// ── Enhanced Health Check ──
// Accessible at /health AND /api/health (via vercel.json proxy)
app.get("/health", async (req, res) => {
  const checks = {
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      has_database_url: !!process.env.DATABASE_URL,
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV || "development",
    },
    database: "checking",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
    res.json(checks);
  } catch (err) {
    checks.database = "error";
    checks.database_error = err.message;
    res.status(503).json(checks);
  }
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

app.listen(PORT, async () => {
  console.log(`🚀 CaseFlow backend running on port ${PORT}`);
  console.log(`📌 DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  console.log(`🔑 JWT_SECRET set: ${!!process.env.JWT_SECRET}`);

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection: OK");
  } catch (err) {
    console.error("❌ Database connection FAILED:", err.message);
    console.error("   → Check your DATABASE_URL environment variable on Render");
  }
});
