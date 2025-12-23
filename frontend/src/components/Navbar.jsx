import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuthStore.jsx";

/**
 * Navbar Component
 * ----------------
 * Displays the top navigation bar of the application.
 * Navigation options are rendered conditionally based on:
 * - Authentication status
 * - Admin privileges
 */
function Navbar() {

  /**
   * Extract authentication-related state and actions
   * - user      → currently logged-in user (null if not authenticated)
   * - isAdmin   → boolean flag to check admin privileges
   * - userLogOut → function to log out the user
   */
  const { user, isAdmin, userLogOut } = useAuth();

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">

        {/* Left section: Application logo */}
        <div className="flex-1">
          <Link to="/">
            <img
              src="/ace_logo.jpg"
              alt="ace logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-base-100 transition-transform duration-200 hover:scale-105"
            />
          </Link>
        </div>

        {/* Right section: Navigation links */}
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">

            {/* Home is always visible */}
            <li>
              <Link to="/" className="btn btn-ghost">
                Home
              </Link>
            </li>

            {/* Profile link: visible only when user is logged in */}
            {user && (
              <li>
                <Link to="/profile" className="btn btn-ghost">
                  Profile
                </Link>
              </li>
            )}

            {/* Admin-only navigation options */}
            {isAdmin && (
              <>
                <li>
                  <Link to="/signup" className="btn btn-ghost">
                    SignUp Users
                  </Link>
                </li>

                <li>
                  <Link to="/add-event" className="btn btn-ghost">
                    Add Event
                  </Link>
                </li>

                <li>
                  <Link to="/view-event" className="btn btn-ghost">
                    View Events
                  </Link>
                </li>

                <li>
                  <Link to="/view-user" className="btn btn-ghost">
                    View Users
                  </Link>
                </li>
              </>
            )}

            {/* Authentication action:
                - Show Logout if user is logged in
                - Show Login if user is not logged in */}
            {user ? (
              <li>
                <button
                  className="btn btn-ghost"
                  onClick={userLogOut}
                >
                  LogOut
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="btn btn-ghost">
                  LogIn
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
