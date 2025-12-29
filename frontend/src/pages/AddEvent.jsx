// React hook for managing component state
import { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { useParams } from "react-router-dom";
// Component responsible for rendering the form
// based on the selected event layout
import LayoutForm from "../components/LayoutForm.jsx";

/* ----------------------------------
   Available Event Layouts
   ---------------------------------- */
const layouts = [
  { id: "layout1", name: "Classic Event" },
  { id: "layout2", name: "Conference" },
  { id: "layout3", name: "Workshop" },
  { id: "layout4", name: "Concert" },
  { id: "layout5", name: "Webinar" },
  { id: "layout6", name: "Festival" },
];

function AddEvent() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  /* ----------------------------------
  Local State
  ---------------------------------- */
  const [selectedLayout, setSelectedLayout] = useState(null); // Currently selected layout
  
 useEffect(() => {
  if (!isEdit) return;

  const loadEvent = async () => {
    const res = await axiosInstance.get("/api/event/v1/get-all-event");

    const event = res.data.events.find(e => e._id === id);
    if (!event) return;

   
    setSelectedLayout(event.layoutSelected);

    console.log("Edit mode:", true, "Layout:", event.layoutSelected);
  };

  loadEvent();
}, [isEdit, id]);
  console.log("Edit mode:", isEdit, "Layout:", selectedLayout);
  return (
    <div className="flex min-h-screen bg-base-200">
      {/* ----------------------------------
         Sidebar: Layout Selector
         ---------------------------------- */}
      <aside className="w-64 bg-base-100 shadow-lg p-4">
        <h1 className="text-xl font-bold mb-4">Select Layout</h1>

        {/* Layout Options */}
        <ul className="menu space-y-1">
          {layouts.map((layout) => (
            <li key={layout.id}>
              <button
                className={`btn btn-ghost justify-start w-full ${
                  selectedLayout === layout.id ? "btn-active" : ""
                }`}
                onClick={() => setSelectedLayout(layout.id)}
              >
                {layout.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Vertical Divider */}
      <div className="w-px bg-base-300" />

      {/* ----------------------------------
         Main Content Area
         ---------------------------------- */}
      <main className="flex-1 p-8 bg-base-100">
        {/* Layout Form */}
        {/* Renders the appropriate form based on selected layout */}
        <div className="w-full">
          <LayoutForm
            selectedLayout={selectedLayout}
            layouts={layouts}
            eventId={id}
            isEdit={isEdit}
            setSelectedLayout={setSelectedLayout}
          />
        </div>
      </main>
    </div>
  );
}

export default AddEvent;
