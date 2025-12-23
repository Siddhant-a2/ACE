import { useState, useEffect } from "react";
import { useEvent } from "../store/useEventStore.jsx";
import { useAuth } from "../store/useAuthStore.jsx";

import HeroSection from "./HeroSection.jsx";
import EventHeroSectionLayout1 from "./layouts/EventHeroSection/EventHeroSectionLayout1.jsx";
import EventHeroSectionLayout2 from "./layouts/EventHeroSection/EventHeroSectionLayout2.jsx";
import EventHeroSectionLayout3 from "./layouts/EventHeroSection/EventHeroSectionLayout3.jsx";
import EventHeroSectionLayout4 from "./layouts/EventHeroSection/EventHeroSectionLayout4.jsx";
import EventHeroSectionLayout5 from "./layouts/EventHeroSection/EventHeroSectionLayout5.jsx";
import EventHeroSectionLayout6 from "./layouts/EventHeroSection/EventHeroSectionLayout6.jsx";

/**
 * HeroSectionEvent Component
 * -------------------------
 * Displays event-based hero sections in a slider format.
 * - Shows default HeroSection if no events are available
 * - Supports multiple layouts per event
 * - Includes auto-slide and manual navigation
 */
function HeroSectionEvent() {

  /**
   * Event-related state
   * - currEvent         → array of current/upcoming events
   * - currEventLoading  → loading state for fetching events
   */
  const { currEvent, currEventLoading } = useEvent();

  /**
   * Authentication-related state
   * - user            → logged-in user (null if not authenticated)
   * - isCheckingAuth  → loading state for auth check
   */
  const { user, isCheckingAuth } = useAuth();

  /**
   * Index of the currently visible event in the slider
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * If there are no events, show default hero section
   */
  if (!currEvent || currEvent.length === 0) {
    return <HeroSection />;
  }

  /**
   * Map layout keys to corresponding layout components
   * Enables dynamic rendering based on event configuration
   */
  const layoutMap = {
    layout1: EventHeroSectionLayout1,
    layout2: EventHeroSectionLayout2,
    layout3: EventHeroSectionLayout3,
    layout4: EventHeroSectionLayout4,
    layout5: EventHeroSectionLayout5,
    layout6: EventHeroSectionLayout6,
  };

  /**
   * Total number of events available for sliding
   */
  const totalEvents = currEvent.length;

  /**
   * Move to next slide
   * Loops back to first slide when last is reached
   */
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === totalEvents - 1 ? 0 : prev + 1
    );
  };

  /**
   * Move to previous slide
   * Loops to last slide when first is reached
   */
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalEvents - 1 : prev - 1
    );
  };

  /**
   * Auto-slide effect
   * - Automatically changes slides every 5 seconds
   * - Disabled when there is only one event
   */
  useEffect(() => {
    if (totalEvents <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [totalEvents]);

  /**
   * Full-screen loader while both:
   * - events are loading
   * - authentication is being checked
   */
  if (currEventLoading && isCheckingAuth && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  /**
   * Slider UI
   */
  return (
    <div className="relative w-full overflow-hidden">

      {/* SLIDER TRACK */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {currEvent.map((event, index) => {
          /**
           * Select layout component based on event configuration
           */
          const LayoutComponent = layoutMap[event.layoutSelected];
          if (!LayoutComponent) return null;

          return (
            <div key={event._id || index} className="min-w-full">
              <LayoutComponent
                data={event}
                className="min-h-screen"
              />
            </div>
          );
        })}
      </div>

      {/* NAVIGATION BUTTONS */}
      {totalEvents > 1 && (
        <>
          {/* Previous Slide */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-neutral z-20"
          >
            ❮
          </button>

          {/* Next Slide */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-neutral z-20"
          >
            ❯
          </button>
        </>
      )}
    </div>
  );
}

export default HeroSectionEvent;
