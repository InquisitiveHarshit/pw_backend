const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    type: {
      type: String,
      enum: ["apartment", "villa", "plot", "commercial", "other"],
      default: "apartment",
    },
    bhk: {
      type: Number,
    },
    area: {
      type: Number, // in sq ft
    },
    amenities: [String],
    totalSlots: {
      type: Number,
      required: [true, "Total slots required"],
      default: 10,
    },
    filledSlots: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["open", "full", "closed"],
      default: "open",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    developerName: {
      type: String,
      default: "Developer",
    },
    aboutDeveloper: {
      type: String,
    },
    sector: {
      type: String,
    },
    possessionDate: {
      type: Date,
    },
    locationHighlights: {
      type: String, // e.g. "Near City Center | Close to Metro"
    },
    promotionalTag: {
      type: String, // e.g. "Selling Fast"
    },
    brochureUrl: {
      type: String, // PDF or image link for brochure
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
