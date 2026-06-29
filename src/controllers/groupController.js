const Group = require("../models/Group");
const Property = require("../models/Property");
const User = require("../models/User");

// @desc   Join (or create) a buying group for a property
// @route  POST /api/groups/join
// @access Logged-in user — TODO: enable auth before production
const joinGroup = async (req, res) => {
  const { propertyId, interestedBHK, budget, message } = req.body;

  if (!propertyId) {
    return res
      .status(400)
      .json({ success: false, message: "propertyId is required." });
  }

  // Fetch property
  const property = await Property.findById(propertyId);
  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found." });
  }

  if (property.status !== "open") {
    return res.status(400).json({
      success: false,
      message: `This property group is ${property.status}. No more slots available.`,
    });
  }

  // Check if user already joined a group for this property
  const existingGroup = await Group.findOne({
    property: propertyId,
    "members.user": req.user._id,
  });

  if (existingGroup) {
    return res.status(400).json({
      success: false,
      message: "You have already joined the group for this property.",
    });
  }

  // Find an open group for this property OR create one
  let group = await Group.findOne({ property: propertyId, status: "forming" });

  const memberEntry = {
    user: req.user._id,
    interestedBHK,
    budget,
    message,
  };

  if (group) {
    // Add to existing group
    group.members.push(memberEntry);
    await group.save();
  } else {
    // Create a new group
    group = await Group.create({
      property: propertyId,
      members: [memberEntry],
    });
  }

  // Increment filledSlots on the property
  property.filledSlots += 1;

  // If full, update statuses
  if (property.filledSlots >= property.totalSlots) {
    property.status = "full";
    group.status = "complete";
    await group.save();
  }

  await property.save();

  // Add group to user's joinedGroups
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { joinedGroups: group._id },
  });

  // Populate the response
  await group.populate("members.user", "name email phone");
  await group.populate("property", "title location price status");

  res.status(200).json({
    success: true,
    message: "Successfully joined the buying group!",
    data: group,
  });
};

// @desc   Get current user's groups
// @route  GET /api/groups/my
// @access Logged-in user — TODO: enable auth before production
const getMyGroups = async (req, res) => {
  const groups = await Group.find({ "members.user": req.user._id })
    .populate("property", "title location price status images")
    .populate("members.user", "name email phone");

  res.status(200).json({ success: true, data: groups });
};

// @desc   Get all groups (admin view)
// @route  GET /api/groups
// @access Admin — TODO: enable auth before production
const getAllGroups = async (req, res) => {
  const groups = await Group.find()
    .populate("property", "title location price status totalSlots filledSlots")
    .populate("members.user", "name email phone createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, total: groups.length, data: groups });
};

// @desc   Get single group detail (admin view)
// @route  GET /api/groups/:id
// @access Admin — TODO: enable auth before production
const getGroupById = async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate("property", "title location price status totalSlots filledSlots images")
    .populate("members.user", "name email phone createdAt joinedGroups");

  if (!group) {
    return res
      .status(404)
      .json({ success: false, message: "Group not found." });
  }

  res.status(200).json({ success: true, data: group });
};

module.exports = { joinGroup, getMyGroups, getAllGroups, getGroupById };
