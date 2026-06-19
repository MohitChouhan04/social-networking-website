const mongoose = require("mongoose");

const connectDB = async () =>{
    const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MongoDB connection string is not set. Add MONGO_URL, MONGO_URI, or MONGODB_URI in Render environment variables.");
    }

    const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;
    const isLocalMongoUri = /^mongodb:\/\/(localhost|127\.0\.0\.1|\[?::1\]?)(:|\/)/i.test(mongoUri);

    if (isProduction && isLocalMongoUri) {
        throw new Error("MONGO_URL points to local MongoDB. On Render, set MONGO_URL to your MongoDB Atlas connection string, for example mongodb+srv://...");
    }

    await mongoose.connect(mongoUri);
    console.log("DB connected");

}
module.exports = connectDB;
