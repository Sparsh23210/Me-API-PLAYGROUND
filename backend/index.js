const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

// Routes
const profileRoutes = require("./routes/profile");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const searchRoutes = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(cors({ origin: "*" })); 
app.use(helmet());

// Body Parser
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // exit app if DB fails
  });

// API Routes
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/search", searchRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
