// React utilities for Context API
import { createContext, useContext } from "react";

// Toast notifications for success/error feedback
import toast from "react-hot-toast";

// Pre-configured Axios instance for API requests
import { axiosInstance } from "../lib/axios.js";

// Context to handle upload signature & Cloudinary uploads
export const SignContext = createContext();

/* ----------------------------------
   Signature Provider Component
   ---------------------------------- */
export const SignProvider = ({ children }) => {

  /* ----------------------------------
     Get Upload Signature from Backend
     ----------------------------------
     - Calls backend API to generate a secure signature
     - Prevents exposing Cloudinary API secret on frontend
     - Returns timestamp, signature, apiKey, and cloudName
  */
  const getSignature = async () => {
    try {
      const res = await axiosInstance.get("/api/upload/v1/signature");
      return res.data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ----------------------------------
     Upload Image to Cloudinary
     ----------------------------------
     - Uploads image directly to Cloudinary from frontend
     - Uses signed request for security
     - Does NOT require Cloudinary API secret on frontend
  */
  const uploadToCloudinary = async ({
    file,
    timestamp,
    signature,
    apiKey,
    cloudName
  }) => {
    try {
      // Create multipart form data
      const formData = new FormData();

      // Required Cloudinary fields
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      // Send upload request directly to Cloudinary
      const res = await axiosInstance.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          withCredentials: false, // Required for external Cloudinary API
        }
      );

      // Return uploaded image secure URL
      return res.data.secure_url;

    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ----------------------------------
     Context Provider
     ---------------------------------- */
  return (
    <SignContext.Provider
      value={{
        getSignature,
        uploadToCloudinary
      }}
    >
      {children}
    </SignContext.Provider>
  );
};

/* ----------------------------------
   Custom Hook for Signature Context
   ---------------------------------- */
export const useSign = () => {
  return useContext(SignContext);
};
