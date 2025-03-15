import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // to protect from SQL injections, XSS , CSRF attacks
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    // to limit the number of requests (Rate Limiting)
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
