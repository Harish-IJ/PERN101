import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT;

console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet()); // Security middleware setsup HTTP headers to protect out application
app.use(morgan("dev")); // logs the reqs

app.get("/test", (req, res) => {
  console.log(res.getHeaders());
  res.send("From Test ok");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
