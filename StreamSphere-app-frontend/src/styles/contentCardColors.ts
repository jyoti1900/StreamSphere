export type ContentCardColorScheme = {
  gradient: string;
  bar: string;
  hoverText: string;
  glow: string;
  border: string;
};

export const contentCardColorMap: Record<string, ContentCardColorScheme> = {
  Action: {
    gradient:
      "linear-gradient(to top, rgba(65,15,15,0.95) 0%, rgba(175,35,30,0.45) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(175,35,30), rgb(215,55,45))",
    hoverText: "rgb(215,55,45)",
    glow: "rgba(215, 55, 45, 0.35)",
    border: "rgba(215, 55, 45, 0.5)",
  },
  Adventure: {
    gradient:
      "linear-gradient(to top, rgba(20,83,45,0.95) 0%, rgba(34,197,94,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(22,101,52), rgb(34,197,94))",
    hoverText: "rgb(74,222,128)",
    glow: "rgba(34, 197, 94, 0.35)",
    border: "rgba(34, 197, 94, 0.5)",
  },
  "Sci-Fi": {
    gradient:
      "linear-gradient(to top, rgba(30,58,138,0.95) 0%, rgba(59,130,246,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(37,99,235), rgb(96,165,250))",
    hoverText: "rgb(96,165,250)",
    glow: "rgba(59, 130, 246, 0.35)",
    border: "rgba(96, 165, 250, 0.5)",
  },
  Thriller: {
    gradient:
      "linear-gradient(to top, rgba(24,24,27,0.98) 0%, rgba(113,113,122,0.45) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(63,63,70), rgb(161,161,170))",
    hoverText: "rgb(212,212,216)",
    glow: "rgba(161, 161, 170, 0.25)",
    border: "rgba(161, 161, 170, 0.45)",
  },
  Romance: {
    gradient:
      "linear-gradient(to top, rgba(131,24,67,0.95) 0%, rgba(244,114,182,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(190,24,93), rgb(244,114,182))",
    hoverText: "rgb(244,114,182)",
    glow: "rgba(244, 114, 182, 0.35)",
    border: "rgba(244, 114, 182, 0.5)",
  },
  Comedy: {
    gradient:
      "linear-gradient(to top, rgba(146,64,14,0.95) 0%, rgba(251,191,36,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(180,83,9), rgb(251,191,36))",
    hoverText: "rgb(251,191,36)",
    glow: "rgba(251, 191, 36, 0.35)",
    border: "rgba(251, 191, 36, 0.5)",
  },
  Drama: {
    gradient:
      "linear-gradient(to top, rgba(124,45,18,0.95) 0%, rgba(249,115,22,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(154,52,18), rgb(249,115,22))",
    hoverText: "rgb(251,146,60)",
    glow: "rgba(249, 115, 22, 0.35)",
    border: "rgba(251, 146, 60, 0.5)",
  },
  Series: {
    gradient:
      "linear-gradient(to top, rgba(76,29,149,0.95) 0%, rgba(139,92,246,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(109,40,217), rgb(167,139,250))",
    hoverText: "rgb(167,139,250)",
    glow: "rgba(139, 92, 246, 0.35)",
    border: "rgba(167, 139, 250, 0.5)",
  },
  Horror: {
    gradient:
      "linear-gradient(to top, rgba(69,10,10,0.98) 0%, rgba(127,29,29,0.5) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(127,29,29), rgb(185,28,28))",
    hoverText: "rgb(248,113,113)",
    glow: "rgba(185, 28, 28, 0.35)",
    border: "rgba(248, 113, 113, 0.5)",
  },
  Anime: {
    gradient:
      "linear-gradient(to top, rgba(14,116,144,0.95) 0%, rgba(34,211,238,0.4) 40%, transparent 100%)",
    bar: "linear-gradient(to right, rgb(8,145,178), rgb(34,211,238))",
    hoverText: "rgb(34,211,238)",
    glow: "rgba(34, 211, 238, 0.35)",
    border: "rgba(34, 211, 238, 0.5)",
  },
};

const defaultColorSchemes = Object.values(contentCardColorMap);

function normalizeGenreKey(genre: string) {
  const lower = genre.toLowerCase();
  if (lower.includes("sci")) return "Sci-Fi";
  if (lower.includes("action")) return "Action";
  if (lower.includes("adventure")) return "Adventure";
  if (lower.includes("thriller")) return "Thriller";
  if (lower.includes("romance")) return "Romance";
  if (lower.includes("comedy")) return "Comedy";
  if (lower.includes("drama")) return "Drama";
  if (lower.includes("series")) return "Series";
  if (lower.includes("horror")) return "Horror";
  if (lower.includes("anime")) return "Anime";
  return "";
}

export function getContentCardColors(genre: string, index: number): ContentCardColorScheme {
  const key = normalizeGenreKey(genre);
  if (key && contentCardColorMap[key]) return contentCardColorMap[key];

  const exact = Object.keys(contentCardColorMap).find(
    (name) => name.toLowerCase() === genre.toLowerCase()
  );
  if (exact) return contentCardColorMap[exact];

  return defaultColorSchemes[index % defaultColorSchemes.length];
}
