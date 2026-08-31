import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eligibilityRoutes from "./routes/eligibility.routes.js";
import { verifyDbConnection } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", eligibilityRoutes);

// Fallback error handler for anything that slips past a controller's try/catch.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

async function start() {
  try {
    await verifyDbConnection();
  } catch (err) {
    console.error("Could not connect to MySQL. Check your .env settings.", err.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`Loan eligibility API running on http://localhost:${PORT}`));
}

start();
