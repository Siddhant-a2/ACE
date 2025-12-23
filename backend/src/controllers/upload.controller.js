// Import Cloudinary v2 SDK for generating upload signatures
import { v2 as cloudinary } from "cloudinary";


// ===================== CLOUDINARY SIGNATURE CONTROLLER =====================
export const getSignature = async (req, res) => {
  // Generate current timestamp (required by Cloudinary for signed uploads)
  const timestamp = Math.round(Date.now() / 1000);

  try {
    // Generate a secure Cloudinary signature using timestamp and API secret
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp
      },
      process.env.CLOUDINARY_API_SECRET
    );
  
    // Send signature details back to frontend
    // Frontend uses this data to upload files directly to Cloudinary
    res.json({
      timestamp,                                  // Upload timestamp
      signature,                                  // Signed request hash
      cloudName: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
      apiKey: process.env.CLOUDINARY_API_KEY,       // Public API key
    });
    
  } catch (error) {
    // Handle unexpected server errors
    res.json({ message: "Internal Server error", error });
  }
};
