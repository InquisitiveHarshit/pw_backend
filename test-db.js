require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error("❌ MONGO_URI environment variable is not set.");
      process.exit(1);
    }

    // Mask password in URI for logging
    const maskedUri = uri.replace(/:([^:@]{3,})@/, ':***@');
    console.log(`Connecting to: ${maskedUri}`);

    const conn = await mongoose.connect(uri);

    console.log("\n✅ MongoDB Connection Successful!");
    console.log("===================================");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Port: ${conn.connection.port}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log("===================================\n");

    process.exit(0);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

testConnection();
