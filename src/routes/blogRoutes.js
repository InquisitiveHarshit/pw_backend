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

// POST /api/blogs
router.post("/", createBlog);

// PUT /api/blogs/:id
router.put("/:id", updateBlog);

// DELETE /api/blogs/:id
router.delete("/:id", deleteBlog);

module.exports = router;
