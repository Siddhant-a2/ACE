// React hook for managing component state
import { useState } from "react";

// Icons used in the login form UI
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

// Authentication store (handles login logic and loading state)
import { useAuth } from "../store/useAuthStore.jsx";

function Login() {

  /* ----------------------------------
     Form State
     ---------------------------------- */
  const [formData, setFormData] = useState({
    username: "",   // User-entered username
    password: "",   // User-entered password
  });

  // Toggle for showing / hiding password text
  const [showPassword, setShowPassword] = useState(false);

  /* ----------------------------------
     Auth Store
     ---------------------------------- */
  const {
    userLogIn,      // Function to authenticate user
    isLoggingIn     // Loading state during login request
  } = useAuth();

  /* ----------------------------------
     Form Submit Handler
     ---------------------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();   // Prevent page reload
    userLogIn(formData);  // Send login credentials to backend
  };

  return (
    // Page wrapper to center the login card
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-base-200 px-4">

      {/* Login Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          {/* Page Title */}
          <h2 className="text-2xl font-bold text-center">Log In</h2>
          <p className="text-center text-sm text-gray-500">
            Welcome back! Please sign in to continue
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>

              <div className="relative">
                {/* Username Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>

                {/* Username Input */}
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="123456789"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative">
                {/* Password Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>

                {/* Password Input */}
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                {/* Show / Hide Password Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  {/* Loading Spinner */}
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Log in"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
