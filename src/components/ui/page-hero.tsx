interface PageHeroProps {
  /** compact = short banner (marketplace). full = tall hero (home). */
  variant?: "full" | "compact";
  children?: React.ReactNode;
}

/**
 * Shared hero banner with video/image background, green overlay, and wave bottom.
 * variant="full"    → min-height calc(100vh - 64px), used on home page
 * variant="compact" → fixed 220px height, used on inner pages
 */
export function PageHero({ variant = "full", children }: PageHeroProps) {
  const isCompact = variant === "compact";

  return (
    <section
      className="relative overflow-hidden bg-primary-active"
      style={
        isCompact
          ? { height: "330px" }
          : { minHeight: "calc(100vh - 64px)", maxHeight: "800px" }
      }
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={isCompact ? undefined : { animation: "heroKenBurns 20s ease-in-out infinite alternate" }}
      >
        <source src="/videos/hero-rice-field.mp4" type="video/mp4" />
      </video>

      {/* Overlay — slightly darker on compact for contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: isCompact
            ? "linear-gradient(135deg, rgba(27,67,50,0.78) 0%, rgba(45,106,79,0.60) 60%, rgba(27,67,50,0.50) 100%)"
            : "linear-gradient(135deg, rgba(27,67,50,0.82) 0%, rgba(45,106,79,0.65) 50%, rgba(27,67,50,0.45) 100%)",
        }}
      />

      {/* Fallback gradient */}
      <div className="hero-gradient absolute inset-0 -z-10" />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full">{children}</div>
      )}

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ marginBottom: "-2px" }}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          style={{ display: "block" }}
        >
          <path
            d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
