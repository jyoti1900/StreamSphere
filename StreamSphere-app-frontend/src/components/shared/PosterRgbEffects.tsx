import { ContentCardColorScheme } from "@/styles/contentCardColors";

type PosterRgbEffectsProps = {
  colors: ContentCardColorScheme;
  title?: string;
  category?: string;
  showTitleOverlay?: boolean;
};

export default function PosterRgbEffects({
  colors,
  title,
  category,
  showTitleOverlay = true,
}: PosterRgbEffectsProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-4 -top-4 z-[1] h-20 w-20 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: colors.glow }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: colors.gradient }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 2px ${colors.border}` }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[2] h-1 w-0 transition-all duration-300 group-hover:w-full"
        style={{ background: colors.bar }}
      />

      {showTitleOverlay && title && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p
            className="line-clamp-2 text-sm font-semibold leading-tight text-white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {title}
          </p>
          {category && (
            <p
              className="mt-1 text-xs font-medium uppercase tracking-wider"
              style={{ color: colors.hoverText }}
            >
              {category}
            </p>
          )}
        </div>
      )}
    </>
  );
}
