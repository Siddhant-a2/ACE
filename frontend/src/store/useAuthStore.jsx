// Pre-configured Axios instance for API requests
import { axiosInstance } from "../lib/axios.js";

// React utilities for Context API and state management
import { createContext, useContext, useState } from "react";

// Toast notifications for success/error feedback
import toast from "react-hot-toast";

/* ----------------------------------
   Auth Context Creation
   ---------------------------------- */
export const AuthContext = createContext();

/* ----------------------------------
   Auth Provider Component
   ---------------------------------- */
export const AuthProvider = ({ children }) => {

  /* ----------------------------------
     Authentication & User State
     ---------------------------------- */
  const [user, setUser] = useState(null);            // Logged-in user data
  const [isAdmin, setIsAdmin] = useState(false);     // Admin role flag

  /* ----------------------------------
     Loading & Action States
     ---------------------------------- */
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Initial auth check
  const [isLoggingIn, setIsLoggingIn] = useState(false);      // Login loading state
  const [isSigningUp, setIsSigningUp] = useState(false);     // Signup loading state

  /* ----------------------------------
     Admin: Users Management State
     ---------------------------------- */
  const [users, setUsers] = useState([]);            // Paginated users list
  const [totalPages, setTotalPages] = useState(1);   // Total pages for pagination

  /* ----------------------------------
     Check Existing Authentication
     ---------------------------------- */
  const userAuthentication = async () => {
    try {
      // Verify auth session from backend
      const res = await axiosInstance.get("/api/auth/v1/check-auth");
      const authUser = res.data;

      // If user exists, update state
      if (authUser) {
        setUser(authUser.user);
        setIsAdmin(authUser.user.isAdmin);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Stop auth checking loader
      setIsCheckingAuth(false);
    }
  };

  /* ----------------------------------
     User Login
     ---------------------------------- */
  const userLogIn = async (formdata) => {
    try {
      setIsLoggingIn(true);

      // Send login credentials to backend
      const res = await axiosInstance.post(
        "/api/auth/v1/login",
        formdata
      );

      const loginUser = res.data;

      // Update user state on success
      if (loginUser) {
        setUser(loginUser.user);
        setIsAdmin(loginUser.user.isAdmin);
        toast.success("Logged In Successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  /* ----------------------------------
     User Signup (Admin Only)
     ---------------------------------- */
  const userSignUp = async (formdata) => {
    try {
      setIsSigningUp(true);

      // Create new user account
      const res = await axiosInstance.post(
        "/api/auth/v1/signup",
        formdata
      );

      if (res.data) {
        toast.success("New Profile Created Successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  /* ----------------------------------
     User Logout
     ---------------------------------- */
  const userLogOut = async () => {
    try {
      // Invalidate session on backend
      await axiosInstance.post("/api/auth/v1/logout");

      // Clear local auth state
      setUser(null);
      setIsAdmin(false);

      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  /* ----------------------------------
     Update Logged-in User Profile
     ---------------------------------- */
  const profileUpdate = async (formData) => {
    try {
      const res = await axiosInstance.put(
        "/api/auth/v1/update-profile",
        formData
      );

      const updatedProfile = res.data;

      // Update user state after successful update
      if (updatedProfile) {
        setUser(updatedProfile.user);
        setIsAdmin(updatedProfile.user.isAdmin);
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  /* ----------------------------------
     Fetch Users (Admin)
     ---------------------------------- */
  const fetchUsers = async (formData) => {
    try {
      // Fetch users with search, batch & pagination
      const res = await axiosInstance.get(
        `/api/auth/v1/users?search=${formData.search}&batch=${formData.batch}&page=${formData.page}&limit=8`
      );

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  /* ----------------------------------
     Delete User (Admin)
     ---------------------------------- */
  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(
        `/api/auth/v1/delete-user/${id}`
      );
      toast.success("User Deleted Successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  /* ----------------------------------
     Context Provider
     ---------------------------------- */
  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isCheckingAuth,
        isLoggingIn,
        isSigningUp,
        users,
        totalPages,
        userAuthentication,
        userLogIn,
        userLogOut,
        userSignUp,
        profileUpdate,
        fetchUsers,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ----------------------------------
   Custom Hook for Auth Context
   ---------------------------------- */
export const useAuth = () => {
  return useContext(AuthContext);
};
