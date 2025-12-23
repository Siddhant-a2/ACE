// Import Express framework to create the backend server
import express from "express";

// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";

// Import authentication-related routes
import authRoutes from "./routes/auth.route.js";

// Import database connection function
import { connectDB } from "./libs/db.js";

// Import cookie-parser to read cookies from incoming requests
import cookieParser from "cookie-parser";

// Import event-related routes
import eventRoutes from "./routes/event.route.js";

// Import upload-related routes (e.g., Cloudinary image uploads)
import uploadRoute from "./routes/upload.route.js";

// Import CORS middleware to handle cross-origin requests
import cors from "cors";


// Load environment variables into process.env
dotenv.config();

// Create an Express application instance
const app = express();

// Get PORT number from environment variables
const PORT = process.env.PORT;


// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Middleware to parse cookies attached to client requests
app.use(cookieParser());

// Enable CORS so frontend (Vite/React) can communicate with backend
app.use(cors({
    // Allow requests only from this frontend origin
    origin: "http://localhost:5173",
    
    // Allow cookies and credentials to be sent
    credentials: true,
}));


// Authentication routes (login, signup, logout, etc.)
app.use("/api/auth/v1", authRoutes);

// Event-related routes (create, fetch, delete events)
app.use("/api/event/v1", eventRoutes);

// Upload routes (image uploads, signature generation, etc.)
app.use("/api/upload/v1", uploadRoute);


// Start the server on the specified PORT
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    
    // Connect to the database once server starts
    connectDB();
});
