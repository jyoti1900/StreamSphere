/** StreamSphere short-logo brand reds */
export const brandRed = {
  highlight: "rgb(215, 55, 45)",
  primary: "rgb(175, 35, 30)",
  shadow: "rgb(65, 15, 15)",
} as const;

export const adminBrandGradient =
  "bg-gradient-to-br from-[rgb(65,15,15)] via-[rgb(175,35,30)] to-[rgb(215,55,45)]";

export const adminCard =
  "rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-xl shadow-black/20";

export const adminTableWrap = `${adminCard} overflow-hidden`;

export const adminTableHead =
  "bg-zinc-800/80 text-zinc-400 text-xs uppercase tracking-wider";

export const adminTableRow = "border-t border-white/5 hover:bg-white/[0.03] transition-colors";

export const adminInput =
  "w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[rgb(215,55,45)]/50 focus:ring-2 focus:ring-[rgb(215,55,45)]/20";

export const adminBtnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgb(175,35,30)] to-[rgb(215,55,45)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(65,15,15,0.35)] transition hover:from-[rgb(195,45,38)] hover:to-[rgb(225,65,55)]";

export const adminBtnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700/80";

export const adminBtnEdit =
  "inline-flex items-center justify-center rounded-lg bg-blue-600/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500";

export const adminBtnDanger =
  "inline-flex items-center justify-center rounded-lg bg-[rgb(175,35,30)] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[rgb(215,55,45)]";

export const adminFab =
  "fixed bottom-8 right-8 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[rgb(175,35,30)] to-[rgb(215,55,45)] px-6 py-3 text-sm font-bold text-white shadow-2xl shadow-[rgba(65,15,15,0.45)] transition hover:scale-105 hover:from-[rgb(195,45,38)] hover:to-[rgb(225,65,55)]";

export const adminModalOverlay =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm";

export const adminModal = `${adminCard} w-full max-w-md p-6 lg:p-8`;

export const adminPageTitle = "text-2xl font-bold tracking-tight text-white lg:text-3xl";

export const adminPageSubtitle = "mt-1 text-sm text-zinc-400";
