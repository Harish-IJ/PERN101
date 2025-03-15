import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT;

console.log(PORT);

app.use(express.json()); // parse incoming data
app.use(cors()); // enable cors
app.use(helmet()); // Security middleware setsup HTTP headers to protect out application
app.use(morgan("dev")); // logs the reqs

// ARCJET MIDDLEWARE
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      // Specifies no. of token per req
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ success: false, message: "Rate Limit Exceeded" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ success: false, message: "Bot Detected" });
      } else {
        res.status(403).json({ success: false, message: "Unauthorized" });
      }
      return;
    }

    next();

    // Check for SPOOFED BOTS
    if (decision.reason.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ success: false, message: "Bot Detected" });
    }
  } catch (error) {}
});

app.use("/api/products", productRoutes);

async function initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    console.log("DB Initialized");
  } catch (error) {
    console.error(error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
