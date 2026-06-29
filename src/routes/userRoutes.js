const express = require("express");
const router = express.Router();
const { requireLogin, requireAdmin } = require("../middleware/auth");
const { getAllUsers, getUserById } = require("../controllers/userController");

// GET /api/users — admin only
router.get("/", getAllUsers);

// GET /api/users/:id — admin only
router.get("/:id", getUserById);

module.exports = router;
