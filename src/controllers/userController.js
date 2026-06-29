const User = require("../models/User");

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

module.exports = { getAllUsers, getUserById };
