const express = require("express");
const router = express.Router();
const { requireLogin, requireAdmin } = require("../middleware/auth");
const {
  joinGroup,
  getMyGroups,
  getAllGroups,
  getGroupById,
} = require("../controllers/groupController");

// POST /api/groups/join — logged-in user joins a property group
router.post("/join", joinGroup);

// GET /api/groups/my — logged-in user sees their own groups
router.get("/my", getMyGroups);

// GET /api/groups — admin only, see all groups
router.get("/", getAllGroups);

// GET /api/groups/:id — admin only, group detail
router.get("/:id", getGroupById);

module.exports = router;
