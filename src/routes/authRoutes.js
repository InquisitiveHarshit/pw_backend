const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/auth");
const { register, login, getMe } = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", requireLogin, getMe);

module.exports = router;
