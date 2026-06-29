require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { devMockUser } = require("./middleware/auth");

// Route files
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const groupRoutes = require("./routes/groupRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: [
      "http://localhost:3000",  // Next.js dev
      "http://localhost:5173",  // Vite dev
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── DEV: Mock user removed, real auth enabled ──────────────────────────────────
// Auth middleware will be applied on a per-route basis below.

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Properties Wallah API is running 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`⚠️  DEV MODE: Auth middleware is mocked (req.user = Dev Admin)`);
});

module.exports = app;
