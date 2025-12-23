import PreviewNavbar from "./previewNavbar.jsx";
import EventHeroSectionLayout1 from "./EventHeroSection/EventHeroSectionLayout1.jsx";
import EventHeroSectionLayout2 from "./EventHeroSection/EventHeroSectionLayout2.jsx";
import EventHeroSectionLayout3 from "./EventHeroSection/EventHeroSectionLayout3.jsx";
import EventHeroSectionLayout4 from "./EventHeroSection/EventHeroSectionLayout4.jsx";
import EventHeroSectionLayout5 from "./EventHeroSection/EventHeroSectionLayout5.jsx";
import EventHeroSectionLayout6 from "./EventHeroSection/EventHeroSectionLayout6.jsx";


function PreviewLayout({ layout, data }) {
  
  return (
    <div className="w-180 bg-base-100 border rounded-2xl shadow-2xl overflow-hidden">
      {/* Navbar */}
      <PreviewNavbar />

      {(layout === "layout1") && (
        <EventHeroSectionLayout1 data={data} className="min-h-150"/>
      )}
      {(layout === "layout2") && (
        <EventHeroSectionLayout2 data={data} className="min-h-150"/>
      )}
      {(layout === "layout3") && (
        <EventHeroSectionLayout3 data={data} className="min-h-150"/>
      )}
      {(layout === "layout4") && (
        <EventHeroSectionLayout4 data={data} className="min-h-150"/>
      )}
      {(layout === "layout5") && (
        <EventHeroSectionLayout5 data={data} className="min-h-150"/>
      )}
      {(layout === "layout6") && (
        <EventHeroSectionLayout6 data={data} className="min-h-150"/>
      )}
      
      
      
    </div>
  );
}

export default PreviewLayout;
