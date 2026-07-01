const express = require("express");
const { getLocalities, createLocality, deleteLocality } = require("../controllers/localityController");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(getLocalities)
  .post(requireLogin, requireAdmin, createLocality);

router
  .route("/:id")
  .delete(requireLogin, requireAdmin, deleteLocality);

module.exports = router;
