// React hook for managing local component state
import { useState } from "react";

// Component responsible for rendering live preview of the selected layout
import PreviewLayout from "./PreviewLayout";

// Icons used for image upload button and loading spinner
import { Camera, Loader2 } from "lucide-react";

// Custom hook to get Cloudinary upload signature and upload images
import { useSign } from "../../store/useSignature.jsx";

// Custom hook to manage event-related actions (like adding a new event)
import { useEvent } from "../../store/useEventStore.jsx";

function Layout5({ selectedLayout, layouts }) {

  /* ================= IMAGE FILE STATES ================= */
  // These states store actual image FILE objects (used for upload)
  const [bgImage, setBGImage] = useState(null);
  const [fgImage1, setFGImage1] = useState(null);
  const [fgImage2, setFGImage2] = useState(null);

  /* ================= EVENT STORE ================= */
  // addEvent sends event data to backend/store
  const { addEvent } = useEvent();

  /* ================= LOADING STATE ================= */
  // Controls loading spinner and disables buttons during submission
  const [creatingEvent, setCreatingEvent] = useState(false);

  /* ================= CLOUDINARY HELPERS ================= */
  // getSignature → fetches secure upload signature from backend
  // uploadToCloudinary → uploads image to Cloudinary
  const { getSignature, uploadToCloudinary } = useSign();

  /* ================= FORM DATA ================= */
  // formData is used for:
  // 1. Live preview
  // 2. Final event submission
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    Heading1: "",
    Heading1Check: false,
    Heading2: "",
    Heading2Check: false,
    Paragraph: "",
    ParagraphCheck: false,
    ctaText: "",
    registrationLink: "",
    ctaTextCheck: false,
    BGImage: null,
    BGImageCheck: false,
    FGImage1: null,
    FGImage1Check: false,
    FGImage2: null,
    FGImage2Check: false,
  });

  /* ================= DATE VALIDATION ================= */
  // Ensures users can only select future dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  /* ================= TEXT INPUT HANDLER ================= */
  // Handles all text/date inputs dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE INPUT HANDLER ================= */
  // Handles image selection
  // 1. Stores actual file for upload
  // 2. Stores preview URL for live preview
  const handleChangeImage = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];

    if (name === "BGImage") {
      setBGImage(file);
    } else if (name === "FGImage1") {
      setFGImage1(file);
    } else if (name === "FGImage2") {
      setFGImage2(file);
    }

    // Create preview URL for live preview
    if (file) {
      setFormData({ ...formData, [name]: URL.createObjectURL(file) });
    }
  };

  /* ================= TOGGLE HANDLER ================= */
  // Handles enabling/disabling fields using toggle switches
  const handleCheckChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  /* ================= FORM SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingEvent(true);

    // Use same formData object and append layout info
    const updatedFormData = formData;
    updatedFormData["layoutSelected"] = selectedLayout;

    // Get Cloudinary signature
    const config = await getSignature();

    /* ===== BACKGROUND IMAGE UPLOAD ===== */
    if (bgImage) {
      if (!bgImage.type.startsWith("image/")) {
        alert("Only images allowed");
        return;
      }
      if (bgImage.size > 20 * 1024 * 1024) {
        alert("Image must be under 20MB");
        return;
      }
      config["file"] = bgImage;
      const new_url = await uploadToCloudinary(config);
      updatedFormData.BGImage = new_url;
    }

    /* ===== FOREGROUND IMAGE 1 UPLOAD ===== */
    if (fgImage1) {
      if (!fgImage1.type.startsWith("image/")) {
        alert("Only images allowed");
        return;
      }
      if (fgImage1.size > 20 * 1024 * 1024) {
        alert("Image must be under 20MB");
        return;
      }
      config["file"] = fgImage1;
      const new_url = await uploadToCloudinary(config);
      updatedFormData.FGImage1 = new_url;
    }

    /* ===== FOREGROUND IMAGE 2 UPLOAD ===== */
    if (fgImage2) {
      if (!fgImage2.type.startsWith("image/")) {
        alert("Only images allowed");
        return;
      }
      if (fgImage2.size > 20 * 1024 * 1024) {
        alert("Image must be under 20MB");
        return;
      }
      config["file"] = fgImage2;
      const new_url = await uploadToCloudinary(config);
      updatedFormData.FGImage2 = new_url;
    }

    // Debug final payload
    console.log(updatedFormData);

    // Save event
    addEvent(updatedFormData);

    // Clear image states
    setBGImage(null);
    setFGImage1(null);
    setFGImage2(null);

    // Reset form
    handleReset();
    setCreatingEvent(false);
  };

  /* ================= RESET HANDLER ================= */
  // Resets form to default state
  const handleReset = () => {
    setFormData({
      title: "",
      date: "",
      Heading1: "",
      Heading1Check: true,
      Heading2: "",
      Heading2Check: true,
      Paragraph: "",
      ParagraphCheck: true,
      ctaText: "",
      registrationLink: "",
      ctaTextCheck: true,
      BGImage: null,
      BGImageCheck: true,
      FGImage1: null,
      FGImage1Check: true,
      FGImage2: null,
      FGImage2Check: true,
    });
  };

  return (
    /* ================= MAIN BUILDER LAYOUT ================= */
    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-12">

      {/* ================= LEFT : FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="w-105 bg-base-100 rounded-xl shadow-md p-6 space-y-6"
      >
        {/* Header */}
        <div className="border-b pb-3">
          <h2 className="text-2xl font-bold">
            {layouts.find((l) => l.id === selectedLayout)?.name}
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details below to create your event
          </p>
        </div>

        {/* ================= BASIC INFORMATION ================= */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Event Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Event Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Tech Summit 2025"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Event Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Event Date</span>
              </label>
              <input
                type="date"
                name="date"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
                min={tomorrow.toISOString().split("T")[0]}
              />
            </div>

            {/* Heading 1 */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Heading 1</span>
                <input
                  type="checkbox"
                  name="Heading1Check"
                  className="toggle toggle-primary"
                  checked={formData.Heading1Check}
                  onChange={handleCheckChange}
                />
              </label>
              <input
                type="text"
                name="Heading1"
                placeholder="Event Title"
                className="input input-bordered w-full"
                onChange={handleChange}
                disabled={!formData.Heading1Check}
                required={formData.Heading1Check}
              />
            </div>

            {/* Heading 2 */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Heading 2</span>
                <input
                  type="checkbox"
                  name="Heading2Check"
                  className="toggle toggle-primary"
                  checked={formData.Heading2Check}
                  onChange={handleCheckChange}
                />
              </label>
              <input
                type="text"
                name="Heading2"
                placeholder="A short event description"
                className="input input-bordered w-full"
                onChange={handleChange}
                disabled={!formData.Heading2Check}
                required={formData.Heading2Check}
              />
            </div>

            {/* Paragraph */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Paragraph Description</span>
                <input
                  type="checkbox"
                  name="ParagraphCheck"
                  className="toggle toggle-primary"
                  checked={formData.ParagraphCheck}
                  onChange={handleCheckChange}
                />
              </label>
              <input
                type="text"
                name="Paragraph"
                placeholder="A bit more detail about the event"
                className="input input-bordered w-full"
                onChange={handleChange}
                disabled={!formData.ParagraphCheck}
                required={formData.ParagraphCheck}
              />
            </div>

            {/* Background Image */}
            <div className="form-control md:col-span-2">
              <label className="btn btn-outline btn-primary btn-sm gap-2">
                <Camera className="w-4 h-4" />
                Background Image
                <input
                  type="file"
                  name="BGImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                  required={formData.BGImageCheck}
                />
              </label>
              <input
                type="checkbox"
                name="BGImageCheck"
                className="toggle toggle-primary ml-2"
                checked={formData.BGImageCheck}
                onChange={handleCheckChange}
              />
            </div>

            {/* Foreground Image 1 */}
            <div className="form-control md:col-span-2">
              <label className="btn btn-outline btn-primary btn-sm gap-2">
                <Camera className="w-4 h-4" />
                Foreground Image 1
                <input
                  type="file"
                  name="FGImage1"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                  required={formData.FGImage1Check}
                />
              </label>
              <input
                type="checkbox"
                name="FGImage1Check"
                className="toggle toggle-primary ml-2"
                checked={formData.FGImage1Check}
                onChange={handleCheckChange}
              />
            </div>

            {/* Foreground Image 2 */}
            <div className="form-control md:col-span-2">
              <label className="btn btn-outline btn-primary btn-sm gap-2">
                <Camera className="w-4 h-4" />
                Foreground Image 2
                <input
                  type="file"
                  name="FGImage2"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeImage}
                  required={formData.FGImage2Check}
                />
              </label>
              <input
                type="checkbox"
                name="FGImage2Check"
                className="toggle toggle-primary ml-2"
                checked={formData.FGImage2Check}
                onChange={handleCheckChange}
              />
            </div>

            {/* CTA */}
            <div className="form-control md:col-span-2">
              <label className="label flex justify-between items-center">
                <span className="label-text font-medium">Enable CTA Button</span>
                <input
                  type="checkbox"
                  name="ctaTextCheck"
                  className="toggle toggle-primary"
                  checked={formData.ctaTextCheck}
                  onChange={handleCheckChange}
                />
              </label>

              <input
                type="text"
                name="ctaText"
                placeholder="Register Now"
                className="input input-bordered w-full mb-3"
                value={formData.ctaText}
                onChange={handleChange}
                disabled={!formData.ctaTextCheck}
                required={formData.ctaTextCheck}
              />

              <input
                type="url"
                name="registrationLink"
                placeholder="enter registration link (*required)"
                className="input input-bordered w-full"
                value={formData.registrationLink}
                onChange={handleChange}
                required={formData.ctaTextCheck}
                disabled={!formData.ctaTextCheck}
              />
            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="pt-4 border-t">
          <button
            type="reset"
            className="btn btn-ghost"
            onClick={handleReset}
            disabled={creatingEvent}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={creatingEvent}
          >
            {creatingEvent ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>

      {/* ================= RIGHT : LIVE PREVIEW ================= */}
      <div className="sticky top-6 flex justify-start overflow-visible">
        <div className="origin-top-left scale-[1.11]">
          <PreviewLayout layout={selectedLayout} data={formData} />
        </div>
      </div>
    </div>
  );
}

export default Layout5;
