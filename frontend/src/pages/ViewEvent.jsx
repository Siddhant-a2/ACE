// React hooks for state and lifecycle management
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

// Event store (handles fetching, deleting events, and pagination state)
import { useEvent } from "../store/useEventStore.jsx";

function ViewEvents() {
  const navigate = useNavigate();

  /* ----------------------------------
     Global Event State
     ---------------------------------- */
  const {
    events, // List of events for current page
    pagination, // Pagination metadata (page, totalPages, etc.)
    loading, // Loading state while fetching events
    fetchAllEvents, // Function to fetch events with pagination
    deleteEvent, // Function to delete an event
  } = useEvent();

  /* ----------------------------------
     Local Component State
     ---------------------------------- */
  const [page, setPage] = useState(1); // Current page number
  const [deletingId, setDeletingId] = useState(null); // Track event being deleted

  /* ----------------------------------
     Fetch Events When Page Changes
     ---------------------------------- */
  useEffect(() => {
    fetchAllEvents(page);
  }, [page]);

  /* ----------------------------------
     Delete Event Handler
     ---------------------------------- */
  const handleDelete = async (id) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    // Set deleting state for the selected event
    setDeletingId(id);

    // Delete the event
    await deleteEvent(id);

    // Reset deleting state
    setDeletingId(null);
  };

  /* ----------------------------------
     Global Loading State
     ---------------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">All Events</h1>

      {/* ----------------------------------
         Empty State
         ---------------------------------- */}
      {events.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No events</div>
      ) : (
        <>
          {/* ----------------------------------
             Event List
             ---------------------------------- */}
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between bg-base-100 border rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition"
              >
                {/* Event Details */}
                <div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* Edit Button */}
                  <button
                    className="btn btn-outline btn-primary btn-sm"
                    onClick={() => navigate(`/edit-event/${event._id}`)}
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(event._id)}
                    disabled={deletingId === event._id}
                  >
                    {deletingId === event._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ----------------------------------
             Pagination Controls
             ---------------------------------- */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                {/* Previous Page Button */}
                <button
                  className="join-item btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  «
                </button>

                {/* Page Number Buttons */}
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`join-item btn ${
                      page === i + 1 ? "btn-active" : ""
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  className="join-item btn"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewEvents;
