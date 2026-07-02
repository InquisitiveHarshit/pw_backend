const Locality = require("../models/Locality");

// @desc    Get all localities
// @route   GET /api/localities
// @access  Public
exports.getLocalities = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { state: { $regex: search, $options: "i" } },
          { pincode: { $regex: search, $options: "i" } }
        ]
      };
    }
    const localities = await Locality.find(query).sort({ createdAt: -1 }).limit(100);
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
    const { name, city, state, pincode, activeProjects, activeGroups } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Locality name is required" });
    }

    const exists = await Locality.findOne({ name, city }); // Wait, name is not unique globally, but maybe name+city is? Let's just check name for now or allow duplicates if name+city exists. But let's keep name checking to avoid exact duplicates.
    if (exists) {
      return res.status(400).json({ success: false, message: "Locality already exists" });
    }

    const locality = await Locality.create({
      name,
      city: city || "",
      state: state || "",
      pincode: pincode || "",
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
