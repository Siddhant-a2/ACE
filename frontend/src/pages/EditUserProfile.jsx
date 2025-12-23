// React hooks for state management and lifecycle
import { useEffect, useState } from "react";

// Routing utilities
import { useParams, Link } from "react-router-dom";

// Pre-configured Axios instance for API calls
import { axiosInstance } from "../lib/axios.js";

// Authentication store (used to check admin privileges)
import { useAuth } from "../store/useAuthStore.jsx";

// Icons used in the edit profile UI
import {
  User,
  Mail,
  AtSign,
  GraduationCap,
  ShieldCheck,
  Loader2
} from "lucide-react";

function EditUserProfile() {

  /* ----------------------------------
     Route Params
     ---------------------------------- */
  const { id } = useParams(); // User ID from URL

  /* ----------------------------------
     Global Auth State
     ---------------------------------- */
  const { isAdmin } = useAuth(); // Check if current user is admin

  /* ----------------------------------
     Local State
     ---------------------------------- */
  const [user, setUser] = useState(null);       // Original user data
  const [isSaving, setIsSaving] = useState(false); // Save button loading state

  // Editable form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    batch: user?.batch || "",
    isAdmin: user?.isAdmin || false,
    profilePic: user?.profilePic || ""
  });

  /* ----------------------------------
     Fetch User Data on Component Mount
     ---------------------------------- */
  useEffect(() => {
    fetchUser();
  }, []);

  /* ----------------------------------
     API Call: Fetch Single User
     ---------------------------------- */
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/auth/v1/admin/user/${id}`
      );

      // Store fetched user data
      setUser(res.data);

      // Initialize form fields with fetched data
      setFormData({
        fullName: res.data.fullName,
        username: res.data.username,
        email: res.data.email,
        batch: res.data.batch,
        isAdmin: res.data.isAdmin,
        profilePic: res.data.profilePic,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ----------------------------------
     Handle Input Changes
     ---------------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox and text inputs correctly
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ----------------------------------
     Reset Form to Original Values
     ---------------------------------- */
  const handleReset = () => {
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      batch: user?.batch || "",
      isAdmin: user?.isAdmin || false,
      profilePic: user?.profilePic || ""
    });
  };

  /* ----------------------------------
     Submit Updated Profile
     ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update user profile via admin endpoint
      const res = await axiosInstance.put(
        `/api/auth/v1/admin/update/profile/${id}`,
        formData
      );

      // Update local user state with response
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
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

        {/* Edit Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">

            {/* Header */}
            <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
            <p className="text-sm text-base-content/60">
              {isAdmin
                ? "You have admin privileges to edit all user details."
                : "You can update limited profile information only."}
            </p>

            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">

              {/* Profile Picture Preview */}
              <div className="flex items-center gap-6">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="Profile" />
                    ) : (
                      <div className="flex items-center justify-center bg-base-300 h-full">
                        <User className="w-12 h-12 text-base-content/60" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <InputField
                label="Full Name"
                icon={<User />}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isAdmin}
              />

              {/* Username */}
              <InputField
                label="Username"
                icon={<AtSign />}
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isAdmin}
              />

              {/* Email */}
              <InputField
                label="Email"
                icon={<Mail />}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isAdmin}
              />

              {/* Batch Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Batch</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap />
                  </div>

                  <select
                    className="select select-bordered w-full"
                    value={formData.batch}
                    onChange={(e) =>
                      setFormData({ ...formData, batch: e.target.value })
                    }
                    disabled={!isAdmin}
                  >
                    <option>Select enrolled batch year</option>

                    {/* Dynamically generate batch years */}
                    {Array.from(
                      { length: new Date().getFullYear() - 2015 + 1 },
                      (_, i) => {
                        const year = 2019 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>

              {/* Role Toggle (Admin Only) */}
              {isAdmin && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Role</span>
                  </label>

                  <label className="cursor-pointer flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span>Admin</span>
                    <input
                      type="checkbox"
                      name="isAdmin"
                      className="toggle toggle-primary"
                      checked={formData.isAdmin}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">

                {/* Reset Changes */}
                <button
                  type="reset"
                  className="btn btn-ghost"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                {/* Save Changes */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                {/* Back Navigation */}
                <Link to="/view-user" className="btn btn-outline">
                  Back
                </Link>

              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------
   Reusable Input Field Component
   ---------------------------------- */
function InputField({ label, icon, disabled, ...props }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>

        <input
          {...props}
          disabled={disabled}
          className={`input input-bordered w-full pl-10 ${
            disabled ? "bg-base-200 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default EditUserProfile;
