const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper: generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "Email already registered." });
  }

  const user = await User.create({ name, email, password, phone });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    },
  });
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials." });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    },
  });
};

// @desc   Get current logged-in user
// @route  GET /api/auth/me
// @access Private (requireLogin) — TODO: enable auth before production
const getMe = async (req, res) => {
  // req.user is injected by devMockUser middleware in dev
  const user = await User.findById(req.user._id).populate("joinedGroups");
  res.status(200).json({ success: true, data: user });
};

module.exports = { register, login, getMe };
