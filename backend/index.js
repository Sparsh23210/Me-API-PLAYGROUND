const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
const rateLimit = require("express-rate-limit");


const profileRoutes = require("./routes/profile");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const searchRoutes = require("./routes/search");
const healthRoutes = require("./routes/health");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "https://me-api-playground-herp.vercel.app", // your frontend Vercel URL
  credentials: true
}));
app.use(helmet());


app.use(express.json());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  });


app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(" Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
