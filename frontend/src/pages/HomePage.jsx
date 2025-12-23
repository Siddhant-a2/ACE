// Import the hero section component shown on the home page
import HeroSectionEvent from "../components/HeroSectionEvent.jsx";

// Home page component
// Acts as the landing page of the application
function Home() {
  return (
    <>
      {/* Displays the main hero/event section on the home page */}
      <HeroSectionEvent />
    </>
  );
}

// Export Home component so it can be used in routing
export default Home;
