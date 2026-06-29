const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse the connection (important for serverless)
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("♻️  Reusing existing MongoDB connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5s timeout so Vercel doesn't hang
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do NOT call process.exit(1) — that crashes the serverless function
    throw error; // let the caller handle it
  }
};

module.exports = connectDB;
