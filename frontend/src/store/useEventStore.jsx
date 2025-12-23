// Toast notifications for success/error feedback
import toast from "react-hot-toast";

// Pre-configured Axios instance for API requests
import { axiosInstance } from "../lib/axios.js";

// React utilities for Context API and state management
import { createContext, useContext, useState } from "react";

/* ----------------------------------
   Event Context Creation
   ---------------------------------- */
export const EventContext = createContext();

/* ----------------------------------
   Event Provider Component
   ---------------------------------- */
export const EventProvider = ({ children }) => {

  /* ----------------------------------
     Event State
     ---------------------------------- */
  const [events, setAllEvents] = useState([]);     // All events (paginated)
  const [currEvent, setCurrEvent] = useState([]);  // Currently active events

  /* ----------------------------------
     Loading & Pagination State
     ---------------------------------- */
  const [loading, setLoading] = useState(true);            // Loading for all events
  const [currEventLoading, setCurrEventLoading] = useState(true); // Loading for current events
  const [pagination, setPagination] = useState({});       // Pagination metadata

  /* ----------------------------------
     Fetch All Events (Paginated)
     ---------------------------------- */
  const fetchAllEvents = async (page = 1) => {
    try {
      // Fetch events with pagination
      const res = await axiosInstance.get(
        `/api/event/v1/get-all-event?page=${page}`
      );

      // Update events list and pagination info
      setAllEvents(res.data.events);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  /* ----------------------------------
     Fetch Current / Active Events
     ---------------------------------- */
  const fetchCurrEvents = async () => {
    try {
      // Fetch currently active events
      const res = await axiosInstance.get(
        `/api/event/v1/get-curr-event`
      );

      setCurrEvent(res.data.currEvents);
    } catch (error) {
      console.log(error);
    } finally {
      // Stop current event loading
      setCurrEventLoading(false);
    }
  };

  /* ----------------------------------
     Add New Event
     ---------------------------------- */
  const addEvent = async (formData) => {
    try {
      // Create a new event
      const res = await axiosInstance.post(
        "/api/event/v1/add-event",
        formData
      );

      if (res.data) {
        toast.success("Event Added Successfully");
      }

      // Refresh events after creation
      await fetchAllEvents();
      await fetchCurrEvents();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  /* ----------------------------------
     Delete Event
     ---------------------------------- */
  const deleteEvent = async (id) => {
    try {
      // Delete event by ID
      await axiosInstance.delete(
        `/api/event/v1/delete-event/${id}`
      );

      toast.success("Event Deleted Successfully");

      // Refresh events after deletion
      await fetchAllEvents();
      await fetchCurrEvents();
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
    <EventContext.Provider
      value={{
        events,              // All events (paginated)
        currEvent,           // Current events
        loading,             // Loading state for all events
        currEventLoading,    // Loading state for current events
        pagination,          // Pagination metadata
        fetchAllEvents,      // Fetch all events
        fetchCurrEvents,     // Fetch current events
        addEvent,            // Add new event
        deleteEvent          // Delete event
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

/* ----------------------------------
   Custom Hook for Event Context
   ---------------------------------- */
export const useEvent = () => {
  return useContext(EventContext);
};
