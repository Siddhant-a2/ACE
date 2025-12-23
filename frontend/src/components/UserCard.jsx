import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuthStore.jsx";
import { useState } from "react";

/**
 * UserCard Component
 * ------------------
 * Displays individual user information in a card layout.
 * Provides actions to view, edit, and delete a user.
 */
function UserCard({ user, refresh, search, batch, page }) {

  /**
   * Access deleteUser action from authentication store
   * (usually connected to backend API)
   */
  const { deleteUser } = useAuth();

  /**
   * Local loading state
   * Used to show a spinner while delete operation is in progress
   */
  const [loading, setLoading] = useState(false);

  /**
   * Handles deletion of a user
   * - Shows confirmation popup
   * - Calls backend delete API
   * - Refreshes user list with current filters & pagination
   */
  const handleDelete = async () => {
    setLoading(true);

    // Ask user for confirmation before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    // If user cancels deletion, stop loading and exit
    if (!confirmDelete) {
      setLoading(false);
      return;
    }

    // Delete user using user ID
    await deleteUser(user._id);

    // Refresh user list while keeping current filters
    refresh({
      search: search,
      batch: batch,
      page: page,
    });

    setLoading(false);
  };

  /**
   * Show full-screen loader while deletion is in progress
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  /**
   * User Card UI
   */
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">

        {/* User profile image (fallback if not available) */}
        <img
          src={
            user.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          className="w-20 h-20 rounded-full object-cover"
          alt="profile"
        />

        {/* User basic information */}
        <h2 className="font-bold">{user.username}</h2>
        <p className="text-sm opacity-70">{user.fullName}</p>

        {/* User batch information */}
        <div className="badge badge-outline">Batch {user.batch}</div>

        {/* Action buttons */}
        <div className="card-actions mt-4">
          {/* View user profile */}
          <Link
            to={`/admin/users/${user._id}`}
            className="btn btn-sm btn-info"
          >
            View
          </Link>

          {/* Edit user profile */}
          <Link
            to={`/admin/users/edit/${user._id}`}
            className="btn btn-sm btn-warning"
          >
            Edit
          </Link>

          {/* Delete user */}
          <button
            className="btn btn-sm btn-error"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
