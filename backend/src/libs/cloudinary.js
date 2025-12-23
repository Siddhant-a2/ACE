// Import Cloudinary v2 SDK for image and media management
import { v2 as cloudinary } from "cloudinary";

// Import dotenv config function to load environment variables
import { config } from "dotenv";


// Load environment variables from .env file
config();


// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    // Cloudinary cloud name
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    // Cloudinary public API key
    api_key: process.env.CLOUDINARY_API_KEY,

    // Cloudinary secret API key (keep this secure)
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Export configured Cloudinary instance for use across the app
export default cloudinary;
