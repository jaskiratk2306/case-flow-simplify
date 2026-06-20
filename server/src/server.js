import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: "*", // During dev we allow all, in prod we can restrict
  credentials: true
}));

app.use(express.json());

// Main API Router
app.use("/api", apiRouter);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

app.listen(PORT, () => {
  console.log(`🚀 CaseFlow backend server running on port ${PORT}`);
});
