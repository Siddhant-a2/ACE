// React hooks for managing component state and side effects
import { useEffect, useState } from "react";

// Reusable user card component
import UserCard from "../components/UserCard.jsx";

// Authentication store (used here to fetch users list)
import { useAuth } from "../store/useAuthStore.jsx";

function ViewUser() {

  /* ----------------------------------
     Filter & Pagination State
     ---------------------------------- */
  const [search, setSearch] = useState("");     // Username search query
  const [batch, setBatch] = useState("all");    // Batch filter
  const [page, setPage] = useState(1);          // Current page number

  /* ----------------------------------
     Global Auth State (Users)
     ---------------------------------- */
  const {
    fetchUsers,   // Function to fetch users with filters
    users,        // List of users for the current page
    totalPages    // Total number of pages available
  } = useAuth();

  /* ----------------------------------
     Local Loading State
     ---------------------------------- */
  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     Fetch Users When Filters Change
     ---------------------------------- */
  useEffect(() => {
    setLoading(true);

    // Fetch users based on search, batch, and page
    fetchUsers({
      search: search,
      batch: batch,
      page: page
    });

    // Reset loading state
    setLoading(false);
  }, [search, batch, page]);

  /* ----------------------------------
     Global Loading Screen
     ---------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* ----------------------------------
         Filters Section
         ---------------------------------- */}
      <div className="flex flex-wrap gap-4">

        {/* Search by Username */}
        <input
          type="text"
          placeholder="Search by username"
          className="input input-bordered w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on filter change
          }}
        />

        {/* Batch Filter */}
        <select
          className="select select-bordered"
          value={batch}
          onChange={(e) => {
            setBatch(e.target.value);
            setPage(1); // Reset to first page on filter change
          }}
        >
          <option value="all">All Batches</option>

          {/* Dynamically generate batch years */}
          {Array.from({ length: 20 }, (_, i) => 2015 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* ----------------------------------
         Users Grid
         ---------------------------------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            refresh={fetchUsers}
            search={search}
            batch={batch}
            page={page}
          />
        ))}
      </div>

      {/* ----------------------------------
         Pagination Controls
         ---------------------------------- */}
      <div className="flex justify-center gap-2">

        {/* Previous Page Button */}
        <button
          className="btn btn-outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {/* Page Indicator */}
        <span className="btn btn-ghost">
          Page {page} / {totalPages}
        </span>

        {/* Next Page Button */}
        <button
          className="btn btn-outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default ViewUser;
