// React hooks for managing state and lifecycle
import { useEffect, useState } from "react";

// Hooks & components for routing
import { useParams, Link } from "react-router-dom";

// Pre-configured Axios instance for API calls
import { axiosInstance } from "../lib/axios.js";

// Icons used in the profile UI
import {
  User,
  Mail,
  ShieldCheck,
  GraduationCap,
  AtSign
} from "lucide-react";

function ViewUserProfile() {

  /* ----------------------------------
     Route Parameters
     ---------------------------------- */
  const { id } = useParams(); // User ID from URL

  /* ----------------------------------
     Local State
     ---------------------------------- */
  const [user, setUser] = useState(null); // Selected user's data

  /* ----------------------------------
     Fetch User Data on Mount
     ---------------------------------- */
  useEffect(() => {
    fetchUser();
  }, []);

  /* ----------------------------------
     API Call: Fetch Single User
     ---------------------------------- */
  const fetchUser = async () => {
    try {
      // Fetch user details using admin endpoint
      const res = await axiosInstance.get(
        `/api/auth/v1/admin/user/${id}`
      );

      // Store fetched user data in state
      setUser(res.data);
    } catch (err) {
      // Log error if request fails
      console.error(err);
    }
  };

  /* ----------------------------------
     Loading State
     ---------------------------------- */
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    // Page wrapper
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">

            {/* ----------------------------------
               Header Section
               ---------------------------------- */}
            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* Profile Picture */}
              <div className="avatar">
                <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">

                  {/* Show profile image if available, else show default icon */}
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" />
                  ) : (
                    <div className="flex items-center justify-center bg-base-300 h-full">
                      <User className="w-14 h-14 text-base-content/60" />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic User Info */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-base-content/70">@{user.username}</p>

                {/* Role Badge */}
                <div className="mt-2">
                  {user.isAdmin ? (
                    <span className="badge badge-primary gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </span>
                  ) : (
                    <span className="badge badge-secondary">
                      User
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* ----------------------------------
               User Details Section
               ---------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/60">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {/* Username */}
              <div className="flex items-center gap-3">
                <AtSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/60">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>

              {/* Batch */}
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/60">Batch</p>
                  <p className="font-medium">{user.batch}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-base-content/60">Role</p>
                  <p className="font-medium">
                    {user.isAdmin ? "Administrator" : "Standard User"}
                  </p>
                </div>
              </div>

            </div>

            {/* ----------------------------------
               Action Buttons
               ---------------------------------- */}
            <div className="divider"></div>
            <div className="flex justify-end gap-3">

              {/* Edit User Button */}
              <Link
                to={`/admin/users/edit/${user._id}`}
                className="btn btn-outline btn-primary"
              >
                Edit Profile
              </Link>

              {/* Back Button */}
              <Link
                to="/view-user"
                className="btn btn-outline"
              >
                Back
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUserProfile;
