// React Router components for defining routes and navigation
import { Routes, Route, Navigate } from "react-router-dom";

// Application pages
import Home from "./pages/HomePage.jsx";
import Login from "./pages/LoginPage.jsx";
import SignUp from "./pages/SignUpPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import AddEvent from "./pages/AddEvent.jsx";
import ViewEvent from "./pages/ViewEvent.jsx";
import ViewUser from "./pages/ViewUser.jsx";
import ViewUserProfile from "./pages/ViewUserProfile.jsx";
import EditUserProfile from "./pages/EditUserProfile.jsx";
import Error from "./pages/ErrorPage.jsx";

// Reusable components
import Navbar from "./components/Navbar.jsx";

// React hooks
import { useEffect } from "react";

// Authentication store (global auth state)
import { useAuth } from "./store/useAuthStore.jsx";

// Event store (global event state)
import { useEvent } from "./store/useEventStore.jsx";

// Loader icon for loading state
import { Loader } from "lucide-react";

// Toast notifications
import { Toaster } from "react-hot-toast";

function App() {
  /* ----------------------------------
     Global Auth State
     ---------------------------------- */
  const {
    user, // Logged-in user object
    isAdmin, // Boolean flag for admin users
    userAuthentication, // Function to verify user session
    isCheckingAuth, // Loading state while checking auth
  } = useAuth();

  /* ----------------------------------
     Global Event State
     ---------------------------------- */
  const {
    currEventLoading, // Loading state for current events
    fetchCurrEvents, // Function to fetch active events
  } = useEvent();

  /* ----------------------------------
     Initial App Load
     - Check authentication
     - Fetch current events
     ---------------------------------- */
  useEffect(() => {
    userAuthentication();
    fetchCurrEvents();
  }, []);

  /* ----------------------------------
     Global Loading Screen
     - Shown while auth & events are loading
     ---------------------------------- */
  if (currEventLoading && isCheckingAuth && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Global Navbar (visible on all pages) */}
      <Navbar />

      {/* Application Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* Admin-Only Routes */}
        <Route
          path="/signup"
          element={isAdmin ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/add-event"
          element={isAdmin ? <AddEvent /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-event/:id"
          element={isAdmin ? <AddEvent /> : <Navigate to="/" />}
        />

        <Route
          path="/view-event"
          element={isAdmin ? <ViewEvent /> : <Navigate to="/" />}
        />
        <Route
          path="/view-user"
          element={isAdmin ? <ViewUser /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/users/:id"
          element={isAdmin ? <ViewUserProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/users/edit/:id"
          element={isAdmin ? <EditUserProfile /> : <Navigate to="/" />}
        />

        {/* Authenticated User Routes */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-profile"
          element={user ? <EditProfile /> : <Navigate to="/" />}
        />

        {/* Fallback Route (404 Page) */}
        <Route path="*" element={<Error />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster />
    </>
  );
}

export default App;
