const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        // Extra info captured from the joining form
        interestedBHK: String,
        budget: Number,
        message: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["forming", "complete"],
      default: "forming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
