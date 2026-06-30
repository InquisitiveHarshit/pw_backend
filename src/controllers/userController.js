const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc   Get all users (admin)
// @route  GET /api/users
// @access Admin — TODO: enable auth before production
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .populate("joinedGroups", "property status createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
};

// @desc   Get single user detail (admin)
// @route  GET /api/users/:id
// @access Admin — TODO: enable auth before production
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate({
    path: "joinedGroups",
    populate: {
      path: "property",
      select: "title location price status",
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.status(200).json({ success: true, data: user });
};

// @desc   Create a user (admin)
// @route  POST /api/users
// @access Admin
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists." });
    }

    const user = await User.create({ name, email, password, phone, role: role || "user" });
    
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser };
