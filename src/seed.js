/**
 * SEED SCRIPT
 * Run with: 
 * Seeds: 1 admin, 2 users, 2 properties, 1 group, 2 blogs
 * ⚠️ This will CLEAR all existing data before seeding.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Property = require("./models/Property");
const Group = require("./models/Group");
const Blog = require("./models/Blog");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ⚠️ Removed deleteMany() calls to preserve existing data.

    // --- USERS ---
    let adminUser = await User.findOne({ email: "admin@propertieswallah.com" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin Properties Wallah",
        email: "admin@propertieswallah.com",
        password: "Admin@123",
        phone: "9999999999",
        role: "admin",
      });
      console.log("👤 Admin user created");
    } else {
      console.log("👤 Admin user already exists");
    }

    let user1 = await User.findOne({ email: "rahul@example.com" });
    if (!user1) {
      user1 = await User.create({
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: "User@123",
        phone: "9876543210",
        role: "user",
      });
      console.log("👤 User 1 created");
    }

    let user2 = await User.findOne({ email: "priya@example.com" });
    if (!user2) {
      user2 = await User.create({
        name: "Priya Mehta",
        email: "priya@example.com",
        password: "User@123",
        phone: "9123456789",
        role: "user",
      });
      console.log("👤 User 2 created");
    }

    // --- PROPERTIES ---
    let property1 = await Property.findOne({ title: "Sunrise Heights — 3 BHK Apartments" });
    if (!property1) {
      property1 = await Property.create({
        title: "Sunrise Heights — 3 BHK Apartments",
        description:
          "Premium 3 BHK apartments in the heart of Gurugram. Group buying discount of up to 12% available for early buyers. Clubhouse, gym, swimming pool, and 24/7 security included.",
        location: "Sector 56, Gurugram, Haryana",
        price: 8500000,
        type: "apartment",
        bhk: 3,
        area: 1450,
        totalSlots: 10,
        filledSlots: 1,
        status: "open",
        isFeatured: true,
        amenities: ["Swimming Pool", "Gym", "Clubhouse", "24/7 Security", "Power Backup"],
        images: [],
        postedBy: adminUser._id,
      });
      console.log("🏠 Property 1 created");

      // --- GROUP ---
      const group1 = await Group.create({
        property: property1._id,
        status: "forming",
        members: [
          {
            user: user1._id,
            interestedBHK: "3BHK",
            budget: 9000000,
            message: "Looking for good investment opportunity",
          },
        ],
      });

      // Link group to user
      await User.findByIdAndUpdate(user1._id, {
        $addToSet: { joinedGroups: group1._id },
      });
      console.log("👥 Group created");
    } else {
      console.log("🏠 Property 1 already exists");
    }

    let property2 = await Property.findOne({ title: "Green Valley Villas — 4 BHK" });
    if (!property2) {
      property2 = await Property.create({
        title: "Green Valley Villas — 4 BHK",
        description:
          "Luxurious independent villas with private garden and terrace. Located in a gated community with 24/7 security. Perfect for group investment.",
        location: "Whitefield, Bangalore",
        price: 15000000,
        type: "villa",
        bhk: 4,
        area: 2800,
        totalSlots: 5,
        filledSlots: 0,
        status: "open",
        isFeatured: true,
        amenities: ["Private Garden", "Terrace", "2 Car Parking", "Club Access"],
        images: [],
        postedBy: adminUser._id,
      });
      console.log("🏠 Property 2 created");
    }

    // --- BLOGS ---
    const blog1 = await Blog.findOne({ title: "Why Group Buying is the Future of Real Estate in India" });
    if (!blog1) {
      await Blog.create({
        title: "Why Group Buying is the Future of Real Estate in India",
        content: `Group buying in real estate is transforming how Indians invest in property. 
By pooling resources, buyers unlock bulk discounts that are simply unavailable to individual buyers.
Properties Wallah is pioneering this concept in India, connecting like-minded buyers to purchase together.

Key benefits of group buying:
- Discounts of 8–15% vs individual purchase
- Stronger negotiating position with builders
- Shared due diligence costs
- Access to premium properties that may be out of individual reach

Join a group today and experience the future of real estate investment.`,
        excerpt:
          "Discover how group buying unlocks 8–15% discounts on real estate that individual buyers never get.",
        tags: ["group buying", "real estate", "investment"],
        coverImage: "",
        author: adminUser._id,
        isPublished: true,
      });
      console.log("📝 Blog 1 created");
    }

    const blog2 = await Blog.findOne({ title: "Top 5 Locations for Real Estate Investment in 2025" });
    if (!blog2) {
      await Blog.create({
        title: "Top 5 Locations for Real Estate Investment in 2025",
        content: `Real estate experts agree that 2025 is a pivotal year for Indian property markets.
Here are the top 5 locations to watch:

1. **Gurugram (Sector 56–80)** — Metro connectivity + corporate hub driving demand
2. **Whitefield, Bangalore** — IT corridor with strong rental yields
3. **Hinjewadi, Pune** — Affordable prices with rapid infrastructure growth
4. **OMR, Chennai** — Tech parks creating sustained housing demand  
5. **Noida Expressway** — Upcoming metro extension making this a goldmine

Use Properties Wallah to join a buying group in any of these locations today!`,
        excerpt:
          "Expert picks for the top 5 Indian real estate investment hotspots in 2025.",
        tags: ["investment", "2025", "locations", "market trends"],
        coverImage: "",
        author: adminUser._id,
        isPublished: true,
      });
      console.log("📝 Blog 2 created");
    }

    console.log("\n✅ Seed complete! Login credentials:");
    console.log("   Admin  → admin@propertieswallah.com / Admin@123");
    console.log("   User 1 → rahul@example.com / User@123");
    console.log("   User 2 → priya@example.com / User@123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
