// Enables additional checks and warnings in development mode
// Helps identify unsafe lifecycles, side effects, and deprecated APIs
import { StrictMode } from 'react';

// React 18 method to create a root for rendering the app
import { createRoot } from 'react-dom/client';

// Main App component (root component of the application)
import App from './App.jsx';

// Provides client-side routing (no page reloads)
import { BrowserRouter } from "react-router-dom";

// Global CSS file
import './index.css';

// Context provider for authentication (user login, logout, auth state)
import { AuthProvider } from './store/useAuthStore.jsx';

// Context provider for Cloudinary / upload signature handling
import { SignProvider } from './store/useSignature.jsx';

// Context provider for event-related state (events, current event, etc.)
import { EventProvider } from './store/useEventStore.jsx';

// Create a React root and render the application
createRoot(document.getElementById('root')).render(
  
  // AuthProvider wraps the entire app
  // So authentication state is available everywhere
  <AuthProvider> 
    
    {/* EventProvider manages all event-related global state */}
    <EventProvider>

      {/* SignProvider manages upload signatures and related logic */}
      <SignProvider>

        {/* StrictMode helps catch bugs during development */}
        <StrictMode>

          {/* BrowserRouter enables routing across the app */}
          <BrowserRouter>

            {/* Main application component */}
            <App />

          </BrowserRouter>
        </StrictMode>

      </SignProvider>
    </EventProvider>
  </AuthProvider>,
);
