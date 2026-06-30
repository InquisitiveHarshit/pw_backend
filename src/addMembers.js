require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Group = require("./models/Group");

const addMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Create a "paid" user
    let paidUser = await User.findOne({ email: "paiduser@example.com" });
    if (!paidUser) {
      paidUser = await User.create({
        name: "Paid Member",
        email: "paiduser@example.com",
        password: "User@123",
        phone: "9998887776",
        role: "user",
        // Assuming you have a way to distinguish paid users, like a subscription plan
        // If not, we just treat them as a group member
      });
      console.log("👤 Paid user created");
    }

    // 2. Create another normal user
    let normalUser = await User.findOne({ email: "normaluser@example.com" });
    if (!normalUser) {
      normalUser = await User.create({
        name: "Normal User",
        email: "normaluser@example.com",
        password: "User@123",
        phone: "9998887775",
        role: "user",
      });
      console.log("👤 Normal user created");
    }

    // 3. Add them to the group
    const group = await Group.findOne(); // gets the Sunrise Heights group
    if (group) {
      // Check if they are already in the group
      const membersList = group.members.map(m => m.user.toString());
      
      let updated = false;
      if (!membersList.includes(paidUser._id.toString())) {
        group.members.push({
          user: paidUser._id,
          interestedBHK: "3BHK",
          budget: 9500000,
          message: "Paid member joining!"
        });
        updated = true;
      }

      if (!membersList.includes(normalUser._id.toString())) {
        group.members.push({
          user: normalUser._id,
          interestedBHK: "2BHK",
          budget: 8000000,
          message: "Normal member joining!"
        });
        updated = true;
      }

      if (updated) {
        await group.save();
        console.log("👥 Added new members to the group!");
      } else {
        console.log("👥 Members are already in the group.");
      }
    }

    console.log("\n✅ Script complete! Login credentials:");
    console.log("   Admin       → admin@propertieswallah.com / Admin@123");
    console.log("   Group User  → rahul@example.com / User@123");
    console.log("   Paid User   → paiduser@example.com / User@123");
    console.log("   Normal User → normaluser@example.com / User@123");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addMembers();
