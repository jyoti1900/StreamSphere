export const PREMIUM_STORAGE_KEY = "streamspherePremium";

export function readPremiumFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === "true";
}

export function setPremiumActive(active: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREMIUM_STORAGE_KEY, active ? "true" : "false");
}

function hasActiveSubscription(record: Record<string, unknown>): boolean {
  const expiry = record.subscriptionExpiresAt;
  if (!expiry) return false;

  const date = new Date(String(expiry));
  return !Number.isNaN(date.getTime()) && date > new Date();
}

function parseExpiryDate(value: unknown): Date | null {
  if (!value) return null;

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export type SubscriptionStatus = "active" | "expired" | "none";

export function getSubscriptionStatus(user: unknown): SubscriptionStatus {
  if (!user || typeof user !== "object") {
    return readPremiumFromStorage() ? "active" : "none";
  }

  const record = user as Record<string, unknown>;
  const expiryDate = parseExpiryDate(record.subscriptionExpiresAt);

  if (expiryDate) {
    return expiryDate > new Date() ? "active" : "expired";
  }

  if (hasActiveSubscription(record)) return "active";

  const plan = String(record.subscriptionPlan || record.plan || record.planId || "").toLowerCase();
  if (plan && readPremiumFromStorage()) return "active";

  return "none";
}

export function getSubscriptionExpiresAt(user: unknown): Date | null {
  if (!user || typeof user !== "object") return null;
  return parseExpiryDate((user as Record<string, unknown>).subscriptionExpiresAt);
}

export function getSubscriptionPlanLabel(user: unknown): string | null {
  if (!user || typeof user !== "object") return null;

  const plan = String((user as Record<string, unknown>).subscriptionPlan || "").toLowerCase();
  if (plan === "yearly") return "Yearly Premium";
  if (plan === "monthly") return "Monthly Premium";
  if (plan.includes("premium")) return "Premium Plan";
  return null;
}

export function isPremiumUser(user: unknown): boolean {
  return getSubscriptionStatus(user) === "active";
}

export function applyPremiumSubscription(details: {
  planId: string;
  subscriptionExpiresAt: string;
}) {
  setPremiumActive(true);

  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    const parsed = JSON.parse(savedUser) as Record<string, unknown>;
    const updated = {
      ...parsed,
      isPremium: true,
      subscriptionPlan: details.planId,
      subscriptionExpiresAt: details.subscriptionExpiresAt,
    };

    localStorage.setItem("user", JSON.stringify(updated));
    return updated;
  } catch {
    return null;
  }
}

export type StreamResolution = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "2160p";

export const FREE_MAX_QUALITY: StreamResolution = "720p";
export const PREMIUM_QUALITIES: StreamResolution[] = ["1080p", "2160p"];

const RESOLUTION_RANK: Record<StreamResolution, number> = {
  "144p": 1,
  "240p": 2,
  "360p": 3,
  "480p": 4,
  "720p": 5,
  "1080p": 6,
  "2160p": 7,
};

export function isPremiumQuality(quality: StreamResolution): boolean {
  return PREMIUM_QUALITIES.includes(quality);
}

export function clampQualityForUser(
  quality: StreamResolution,
  isPremium: boolean
): StreamResolution {
  if (isPremium) return quality;
  if (isPremiumQuality(quality)) return FREE_MAX_QUALITY;
  return quality;
}

export function mergePremiumIntoUser<T extends Record<string, unknown>>(user: T): T {
  if (!readPremiumFromStorage()) return user;
  return { ...user, isPremium: true };
}
