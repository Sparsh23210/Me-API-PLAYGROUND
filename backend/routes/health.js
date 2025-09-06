const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Simple health check
router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Detailed health check
router.get("/detailed", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {
      database: "UNKNOWN",
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
      },
    },
  };

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      health.services.database = { status: "OK", type: "MongoDB" };
    } else {
      health.status = "ERROR";
      health.services.database = { status: "DISCONNECTED", type: "MongoDB" };
    }
  } catch (err) {
    health.status = "ERROR";
    health.services.database = { status: "ERROR", error: err.message };
    return res.status(503).json(health);
  }

  res.json(health);
});

// Live check
router.get("/live", (req, res) => {
  res.status(200).json({ status: "alive" });
});


router.get("/ready", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: "ready" });
  } else {
    res.status(503).json({ status: "not ready", error: "MongoDB not connected" });
  }
});

module.exports = router;
