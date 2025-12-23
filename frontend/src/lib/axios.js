import axios from "axios";

/**
 * Create a reusable Axios instance for the entire application.
 * This helps maintain consistent configuration for all API requests.
 */
export const axiosInstance = axios.create({
  
  /**
   * Set the base URL dynamically based on the environment.
   * - In development mode, requests are sent to the local backend server.
   * - In production, requests are sent to the same origin (handled by the deployed server).
   */
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "/",

  /**
   * Enables sending cookies (e.g., JWT, session ID) with every request.
   * Required for authentication when using HTTP-only cookies.
   */
  withCredentials: true,
});
