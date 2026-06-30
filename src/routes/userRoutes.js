const express = require("express");
const router = express.Router();
const { requireLogin, requireAdmin } = require("../middleware/auth");
const { getAllUsers, getUserById, createUser } = require("../controllers/userController");

// GET /api/users — admin only
router.get("/", getAllUsers);

// POST /api/users — admin only (to create new users/admins)
router.post("/", createUser);

// GET /api/users/:id — admin only
router.get("/:id", getUserById);

module.exports = router;
