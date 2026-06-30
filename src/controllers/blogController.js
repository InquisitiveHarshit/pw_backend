const Blog = require("../models/Blog");

// @desc   Get all blogs (public)
// @route  GET /api/blogs
// @access Public
const getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Blog.countDocuments({ isPublished: true });
  const blogs = await Blog.find({ isPublished: true })
    .skip(skip)
    .limit(limit)
    .populate("author", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: blogs,
  });
};

// @desc   Get single blog (public)
// @route  GET /api/blogs/:id
// @access Public
const getBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name email");
  if (!blog || !blog.isPublished) {
    return res.status(404).json({ success: false, message: "Blog not found." });
  }
  res.status(200).json({ success: true, data: blog });
};

// @desc   Create a blog
// @route  POST /api/blogs
// @access Admin — TODO: enable auth before production
const createBlog = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Not authenticated. Please log in." });
  }
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: blog });
};

// @desc   Update a blog
// @route  PUT /api/blogs/:id
// @access Admin — TODO: enable auth before production
const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found." });
  }
  res.status(200).json({ success: true, data: blog });
};

// @desc   Delete a blog
// @route  DELETE /api/blogs/:id
// @access Admin — TODO: enable auth before production
const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found." });
  }
  res.status(200).json({ success: true, message: "Blog deleted." });
};

module.exports = { getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog };
