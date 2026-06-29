const Property = require("../models/Property");

// @desc   Get all properties (public — limited info for guests, full for logged-in)
// @route  GET /api/properties
// @access Public
const getAllProperties = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filters
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.location)
    filter.location = { $regex: req.query.location, $options: "i" };

  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Guest users get limited fields (no slots info)
  const isGuest = !req.user;
  const data = properties.map((p) => {
    const obj = p.toObject();
    if (isGuest) {
      delete obj.totalSlots;
      delete obj.filledSlots;
    }
    return obj;
  });

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data,
  });
};

// @desc   Get single property
// @route  GET /api/properties/:id
// @access Public (guests get less info)
const getProperty = async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "postedBy",
    "name email"
  );

  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found." });
  }

  const obj = property.toObject();

  // Hide slot details from guests
  if (!req.user) {
    delete obj.totalSlots;
    delete obj.filledSlots;
  }

  res.status(200).json({ success: true, data: obj });
};

// @desc   Create a property
// @route  POST /api/properties
// @access Admin — TODO: enable auth before production
const createProperty = async (req, res) => {
  const property = await Property.create({
    ...req.body,
    postedBy: req.user?._id,
  });

  res.status(201).json({ success: true, data: property });
};

// @desc   Update a property
// @route  PUT /api/properties/:id
// @access Admin — TODO: enable auth before production
const updateProperty = async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found." });
  }

  res.status(200).json({ success: true, data: property });
};

// @desc   Delete a property
// @route  DELETE /api/properties/:id
// @access Admin — TODO: enable auth before production
const deleteProperty = async (req, res) => {
  const property = await Property.findByIdAndDelete(req.params.id);

  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found." });
  }

  res.status(200).json({ success: true, message: "Property deleted." });
};

// @desc   Get all groups for a property (with member details)
// @route  GET /api/properties/:id/groups
// @access Admin — TODO: enable auth before production
const getPropertyGroups = async (req, res) => {
  const Group = require("../models/Group");

  const property = await Property.findById(req.params.id);
  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found." });
  }

  const groups = await Group.find({ property: req.params.id }).populate(
    "members.user",
    "name email phone createdAt"
  );

  res.status(200).json({ success: true, data: groups });
};

module.exports = {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyGroups,
};
