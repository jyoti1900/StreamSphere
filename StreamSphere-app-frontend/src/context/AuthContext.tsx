"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { mergePremiumIntoUser, readPremiumFromStorage } from "@/lib/premium";
import { API_BASE_URL } from "@/lib/apiConfig";

export { API_BASE_URL };
export { isPremiumUser, setPremiumActive, readPremiumFromStorage, applyPremiumSubscription } from "@/lib/premium";

export const AUTH_FLASH_KEY = "authFlash";

export const WATCHTIME_URLS = {
  continueWatching: `${API_BASE_URL}/watchtime`,
  update: `${API_BASE_URL}/watchtime/update`,
  remove: (movieId: string) => `${API_BASE_URL}/watchtime/${movieId}`,
};

export type WatchtimePayload = {
  history?: any[];
  inProgress?: any[];
  watchedMoviesCount?: number;
  inProgressMoviesCount?: number;
};

export function parseWatchtimePayload(data: any): WatchtimePayload {
  return data?.data || data || {};
}

export async function fetchContinueWatching(token: string): Promise<WatchtimePayload | null> {
  try {
    const res = await fetch(WATCHTIME_URLS.continueWatching, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return parseWatchtimePayload(data);
  } catch {
    return null;
  }
}

export function findWatchRecord(payload: WatchtimePayload | null, movieId: string) {
  if (!payload) return null;
  const records = [...(payload.inProgress || []), ...(payload.history || [])];
  return records.find((item) => {
    const id = item?.movie?._id || item?.movie?.id;
    return String(id) === String(movieId);
  });
}

export async function updateWatchTimeApi(
  token: string,
  movieId: string,
  watchTime: number
) {
  const res = await fetch(WATCHTIME_URLS.update, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId,
      watchTime: Math.max(0, Math.floor(watchTime)),
    }),
  });
  return res;
}

const AuthContext = createContext<any>(null);

const isValidStoredValue = (value: string | null) =>
  !!value && value !== "undefined" && value !== "null";

function decodeJwtPayload(token: string) {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function parseLoginResponse(data: any, fallbackEmail?: string) {
  const token =
    data?.accessToken ||
    data?.token ||
    data?.data?.accessToken ||
    data?.data?.token;

  if (!token) {
    throw new Error("Login failed: no access token received");
  }

  let userData =
    data?.user ||
    data?.data?.user ||
    (data?.data && typeof data.data === "object" && !Array.isArray(data.data)
      ? data.data
      : null);

  if (userData && (userData.accessToken || userData.token)) {
    const { accessToken, token: _token, ...rest } = userData;
    userData = Object.keys(rest).length > 0 ? rest : null;
  }

  if (!userData || typeof userData !== "object" || Array.isArray(userData)) {
    const jwtPayload = decodeJwtPayload(token);
    userData = {
      id: jwtPayload?.sub || jwtPayload?.id || jwtPayload?.userId || fallbackEmail,
      email: jwtPayload?.email || data?.email || fallbackEmail,
      firstName: jwtPayload?.firstName,
      lastName: jwtPayload?.lastName,
      role: jwtPayload?.role,
    };
  }

  if (!userData.email && fallbackEmail) {
    userData.email = fallbackEmail;
  }

  if (!userData.id) {
    userData.id = userData._id || userData.email || fallbackEmail;
  }

  return { token, userData };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");

    if (isValidStoredValue(savedUser)) {
      try {
        const parsedUser = JSON.parse(savedUser!);
        if (parsedUser && typeof parsedUser === "object") {
          setUser(readPremiumFromStorage() ? mergePremiumIntoUser(parsedUser) : parsedUser);
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user");
      }
    } else if (savedUser) {
      localStorage.removeItem("user");
    }

    if (isValidStoredValue(savedToken)) {
      setToken(savedToken);
    } else if (savedToken) {
      localStorage.removeItem("authToken");
    }

    setIsReady(true);
  }, []);

  const login = (userData: any, authToken: string) => {
    if (!authToken) return false;

    const normalizedUserBase =
      userData && typeof userData === "object" && !Array.isArray(userData)
        ? userData
        : { id: "user", email: "" };

    const normalizedUser = readPremiumFromStorage()
      ? mergePremiumIntoUser(normalizedUserBase)
      : normalizedUserBase;

    setUser(normalizedUser);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("authToken", authToken);
    document.cookie = `authToken=${encodeURIComponent(authToken)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    return true;
  };

  const updateUser = (patch: Record<string, unknown>) => {
    setUser((prev: any) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const logout = (options?: { redirect?: boolean | string }) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("streamspherePremium");
    document.cookie = "authToken=; path=/; max-age=0; SameSite=Lax";

    if (options?.redirect === false) return;

    const destination =
      typeof options?.redirect === "string" ? options.redirect : "/login";
    router.push(destination);
  };

  return (
    <AuthContext.Provider value={{ user, token, isReady, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
