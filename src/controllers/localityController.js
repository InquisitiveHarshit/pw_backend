const Locality = require("../models/Locality");

// @desc    Get all localities
// @route   GET /api/localities
// @access  Public
exports.getLocalities = async (req, res, next) => {
  try {
    const localities = await Locality.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: localities });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a locality
// @route   POST /api/localities
// @access  Private/Admin
exports.createLocality = async (req, res, next) => {
  try {
    const { name, activeProjects, activeGroups } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Locality name is required" });
    }

    const exists = await Locality.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: "Locality already exists" });
    }

    const locality = await Locality.create({
      name,
      activeProjects: activeProjects || 0,
      activeGroups: activeGroups || 0,
    });

    res.status(201).json({ success: true, data: locality });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a locality
// @route   DELETE /api/localities/:id
// @access  Private/Admin
exports.deleteLocality = async (req, res, next) => {
  try {
    const locality = await Locality.findById(req.params.id);
    if (!locality) {
      return res.status(404).json({ success: false, message: "Locality not found" });
    }
    await locality.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
