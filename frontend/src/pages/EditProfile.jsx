// Authentication store (user data & profile update)
import { useAuth } from "../store/useAuthStore";

// Cloudinary signature & upload store
import { useSign } from "../store/useSignature";

// React hook for local state management
import { useState } from "react";

// Icons used throughout the edit profile UI
import {
  User,
  Mail,
  AtSign,
  GraduationCap,
  ShieldCheck,
  Lock,
  Camera,
  Loader2
} from "lucide-react";

function EditProfile() {

  /* ----------------------------------
     Global Stores
     ---------------------------------- */
  const {
    user,          // Logged-in user data
    isAdmin,       // Role flag (admin / normal user)
    profileUpdate  // Function to update profile on backend
  } = useAuth();

  const {
    getSignature,          // Fetch Cloudinary upload signature
    uploadToCloudinary    // Upload image to Cloudinary
  } = useSign();

  /* ----------------------------------
     Local State
     ---------------------------------- */
  const [image, setImage] = useState(null);        // Selected image file
  const [preview, setPreview] = useState(null);   // Image preview URL
  const [isSaving, setIsSaving] = useState(false);// Save button loading state

  // Editable profile form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    batch: user?.batch || "",
    isAdmin: user?.isAdmin || false,
    profilePic: user?.profilePic || "",
    password: "",
    confirmPassword: ""
  });

  /* ----------------------------------
     Handle Profile Image Change
     ---------------------------------- */
  const handleChangeImage = (e) => {
    const file = e.target.files[0];

    // Store selected image file
    setImage(file);

    // Generate preview URL for UI
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ----------------------------------
     Handle Input Changes
     ---------------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox and text inputs properly
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  /* ----------------------------------
     Reset Form to Original User Data
     ---------------------------------- */
  const handleReset = () => {
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      batch: user?.batch || "",
      isAdmin: user?.isAdmin || false,
      profilePic: user?.profilePic || "",
      password: "",
      confirmPassword: ""
    });

    // Reset image selection & preview
    setImage(null);
    setPreview(null);
  };

  /* ----------------------------------
     Submit Profile Updates
     ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Clone form data for safe mutation
    let updatedFormData = { ...formData };

    /* -------- Password Validation -------- */
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setIsSaving(false);
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      setIsSaving(false);
      return;
    }

    /* -------- Profile Image Upload -------- */
    if (image) {

      // Validate image type
      if (!image.type.startsWith("image/")) {
        alert("Only image files are allowed");
        setIsSaving(false);
        return;
      }

      // Validate image size (max 10MB)
      if (image.size > 10 * 1024 * 1024) {
        alert("Image must be under 10MB");
        setIsSaving(false);
        return;
      }

      // Get Cloudinary signature
      const config = await getSignature();
      config.file = image;

      // Upload image & get secure URL
      const newUrl = await uploadToCloudinary(config);

      // Update profile picture URL
      updatedFormData.profilePic = newUrl;
    }

    // Update local state & backend profile
    setFormData(updatedFormData);
    profileUpdate(updatedFormData);

    // Reset image states
    setImage(null);
    setPreview(null);
    setIsSaving(false);
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
                : "You can update your profile picture and password only."}
            </p>

            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">

              {/* Profile Picture Section */}
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

                  {/* Preview of Newly Selected Image */}
                  {preview && (
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={preview} alt="Preview" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex flex-col gap-2">
                  <label className="btn btn-outline btn-primary btn-sm gap-2">
                    <Camera className="w-4 h-4" />
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleChangeImage}
                    />
                  </label>
                  <p className="text-xs text-base-content/60">
                    JPG, PNG up to 10MB
                  </p>
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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isAdmin}
              />

              {/* Batch */}
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

                    {/* Generate batch years dynamically */}
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

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="New Password"
                  icon={<Lock />}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputField
                  label="Confirm Password"
                  icon={<Lock />}
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">

                {/* Reset Button */}
                <button
                  type="reset"
                  className="btn btn-ghost"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

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

export default EditProfile;
