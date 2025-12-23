import Layout1 from "./layouts/Layout1.jsx";
import Layout2 from "./layouts/Layout2.jsx";
import Layout3 from "./layouts/Layout3.jsx";
import Layout4 from "./layouts/Layout4.jsx";
import Layout5 from "./layouts/Layout5.jsx";
import Layout6 from "./layouts/Layout6.jsx";

/**
 * LayoutForm Component
 * -------------------
 * Dynamically renders a layout-specific form based on the selected layout.
 * If no layout is selected, a placeholder message is shown.
 *
 * Props:
 * - selectedLayout : string (currently selected layout key)
 * - layouts        : shared layout configuration/data passed to each layout
 */
function LayoutForm({ selectedLayout, layouts }) {

  /**
   * Fallback UI when no layout is selected
   */
  if (!selectedLayout) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        No layout selected
      </div>
    );
  }

  /**
   * Conditionally render the selected layout form
   */
  return (
    <>
      {/* Layout 1 */}
      {selectedLayout === "layout1" && (
        <Layout1
          selectedLayout={selectedLayout}
          layouts={layouts}
        />
      )}

      {/* Layout 2 */}
      {selectedLayout === "layout2" && (
        <Layout2
          selectedLayout={selectedLayout}
          layouts={layouts}
        />
      )}

      {/* Layout 3 */}
      {selectedLayout === "layout3" && (
        <Layout3
          selectedLayout={selectedLayout}
          layouts={layouts}
        />
      )}

      {/* Layout 4 */}
      {selectedLayout === "layout4" && (
        <Layout4
          selectedLayout={selectedLayout}
          layouts={layouts}
        />
      )}

      {/* Layout 5 */}
      {selectedLayout === "layout5" && (
        <Layout5
          selectedLayout={selectedLayout}
          layouts={layouts}
        />
      )}

      {/* Layout 6 */}
      {selectedLayout === "layout6" && (
        <Layout6
          selectedLayout={selectedLayout}
          layouts={layouts}
        />
      )}
    </>
  );
}

export default LayoutForm;
