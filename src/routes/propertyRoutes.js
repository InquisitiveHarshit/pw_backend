const express = require("express");
const router = express.Router();
const { requireLogin, requireAdmin } = require("../middleware/auth");
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyGroups,
} = require("../controllers/propertyController");

// GET /api/properties — public (guest gets limited data)
router.get("/", getAllProperties);

// GET /api/properties/:id — public (guest gets limited data)
router.get("/:id", getProperty);

// POST /api/properties
router.post("/", createProperty);

// PUT /api/properties/:id
router.put("/:id", updateProperty);

// DELETE /api/properties/:id
router.delete("/:id", deleteProperty);

// GET /api/properties/:id/groups — admin view
router.get("/:id/groups", getPropertyGroups);

module.exports = router;
