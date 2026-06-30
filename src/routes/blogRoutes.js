const express = require("express");
const router = express.Router();
const { requireLogin, requireAdmin } = require("../middleware/auth");
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// GET /api/blogs — public
router.get("/", getAllBlogs);

// GET /api/blogs/:id — public
router.get("/:id", getBlog);

// POST /api/blogs — admin only
router.post("/", requireLogin, requireAdmin, createBlog);

// PUT /api/blogs/:id — admin only
router.put("/:id", requireLogin, requireAdmin, updateBlog);

// DELETE /api/blogs/:id — admin only
router.delete("/:id", requireLogin, requireAdmin, deleteBlog);

module.exports = router;
