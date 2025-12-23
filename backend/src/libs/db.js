// Import mongoose to connect and interact with MongoDB
import mongoose from "mongoose";

// Function to establish connection with MongoDB database
export const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        // Log successful database connection with host information
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        // Log database connection errors for debugging
        console.log("MongoDB connection error: ", error);
    }
};
