import express from "express";
import cors from "cors";
import helmet from "helmet";
import { analyzePassword } from "./analyzer";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Disable Express logs
app.disable("x-powered-by");

// PRIVACY ROUTE
app.post("/analyze", (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid password input" });
  }

  // Analyze only in memory
  const result = analyzePassword(password);

  // Immediately clear reference
  req.body.password = null;

  res.json(result);
});

// Health check
app.get("/", (_, res) => {
  res.json({
    status: "Privacy Backend Running",
    storage: "NONE",
    logs: "NONE"
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Privacy Backend running on port ${PORT}`);
});