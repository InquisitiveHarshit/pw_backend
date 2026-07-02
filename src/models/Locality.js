const mongoose = require("mongoose");

const LocalitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Locality name is required"],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    activeProjects: {
      type: Number,
      default: 0,
    },
    activeGroups: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Locality", LocalitySchema);
