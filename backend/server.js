import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import "./src/db.js"; // connects to MongoDB
import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/posts.js";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://social-media-dnab0l0kn-aastha-ukeys-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// simple test route
app.get("/", (req, res) => {
  res.json({ ok: true, service: "api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
