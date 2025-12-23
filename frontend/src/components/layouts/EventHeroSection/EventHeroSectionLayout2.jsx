// React hooks for managing state and side-effects
import { useEffect, useState } from "react";

// Loader icon for countdown loading state
import { Loader } from "lucide-react";

function EVentHeroSectionLayout2({ data, className }) {

    /* ================= DATA DESTRUCTURING ================= */
    // All layout-specific fields are received from parent via `data`
    const {
        BGImage,
        BGImageCheck,

        FGImage1,
        FGImage1Check,

        FGImage2,
        FGImage2Check,

        Heading1,
        Heading1Check,

        Heading2,
        Heading2Check,

        Paragraph,
        ParagraphCheck,

        ctaText,
        ctaTextCheck,
        registrationLink,

        date,
    } = data;

    /* ================= COUNTDOWN STATE ================= */
    // Stores formatted remaining time
    const [timeLeft, setTimeLeft] = useState("");

    // Controls loading spinner while timer initializes
    const [loading, setLoading] = useState(false);

    /* ================= COUNTDOWN TIMER ================= */
    // Runs whenever event date changes
    useEffect(() => {
        if (!date) return;

        // Show loader while calculating time
        setLoading(true);

        // Convert event date to timestamp
        const target = new Date(date).getTime();

        // Update countdown every second
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = target - now;

            // Event has started or passed
            if (diff <= 0) {
                setTimeLeft("Event Started");
                clearInterval(interval);
                setLoading(false);
                return;
            }

            // Calculate remaining time
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            // Format and update timer string
            setTimeLeft(
                `${d}d : ${h.toString().padStart(2, "0")}h : ${m
                    .toString()
                    .padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`
            );

            setLoading(false);
        }, 1000);

        // Cleanup interval on unmount or date change
        return () => clearInterval(interval);
    }, [date]);

    /* ================= LOADING STATE UI ================= */
    // Show spinner while countdown initializes
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* ================= HERO SECTION ================= */}
            <div
                className={`${className} flex items-center justify-center px-10 py-12 relative`}
                style={{
                    // Use background image if enabled, else gradient
                    backgroundImage:
                        BGImageCheck && BGImage
                            ? `url(${BGImage})`
                            : "linear-gradient(to bottom right, hsl(var(--p)), hsl(var(--s)))",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* ================= CONTENT ================= */}
                <div className="relative z-10 text-center space-y-5 max-w-3xl w-full text-white">

                    {/* ⏳ Countdown Timer */}
                    {date && timeLeft && (
                        <div className="flex justify-center">
                            <span className="badge badge-outline badge-lg font-mono">
                                {timeLeft}
                            </span>
                        </div>
                    )}

                    {/* Heading 1 */}
                    {Heading1Check && (
                        <h1 className="text-5xl font-bold leading-tight">
                            {Heading1 || "Heading1"}
                        </h1>
                    )}

                    {/* Heading 2 */}
                    {Heading2Check && (
                        <h2 className="text-xl opacity-90">
                            {Heading2 || "Heading2"}
                        </h2>
                    )}

                    {/* Paragraph */}
                    {ParagraphCheck && (
                        <p className="text-sm opacity-80">
                            {Paragraph || "Paragraph"}
                        </p>
                    )}

                    {/* Foreground Images */}
                    {(FGImage1Check || FGImage2Check) && (
                        <div className="flex justify-center gap-4 pt-4 flex-wrap">
                            {FGImage1Check && FGImage1 && (
                                <img
                                    src={FGImage1}
                                    className="w-32 h-32 rounded-xl object-cover"
                                    alt="FG 1"
                                />
                            )}
                            {FGImage2Check && FGImage2 && (
                                <img
                                    src={FGImage2}
                                    className="w-32 h-32 rounded-xl object-cover"
                                    alt="FG 2"
                                />
                            )}
                        </div>
                    )}

                    {/* CTA Button */}
                    {ctaTextCheck && (
                        <button
                            className="btn btn-accent btn-lg mt-6"
                            onClick={() => {
                                if (!registrationLink) return;
                                window.open(registrationLink, "_blank");
                            }}
                        >
                            {ctaText || "Register Now"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default EVentHeroSectionLayout2;
