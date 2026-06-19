const mongoose = require("mongoose");

const connectDB = async () =>{
    const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MongoDB connection string is not set. Add MONGO_URL, MONGO_URI, or MONGODB_URI in Render environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("DB connected");

}
module.exports = connectDB;
