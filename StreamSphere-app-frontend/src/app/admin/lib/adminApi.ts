import { ADMIN_API_BASE_URL } from "./config";

export { ADMIN_API_BASE_URL };

export const ADMIN_TOKEN_KEY = "adminToken";
export const ADMIN_USER_KEY = "adminUser";

export type AdminUser = {
  adminId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
};

export type UploadedFileResult = {
  documentId: string;
  signedUrl: string;
  url: string;
  key?: string;
  raw: any;
};

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

export function setAdminSession(accessToken: string, admin: AdminUser) {
  localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
  localStorage.removeItem("adminAuth");
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem("adminAuth");
}

export function getAdminAuthHeaders(includeJson = true): HeadersInit {
  const headers: Record<string, string> = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  headers.accept = "application/json";

  const token = getAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function getAdminUploadHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getAdminToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function readApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message) return message;
  if (typeof record.error === "string" && record.error) return record.error;

  return fallback;
}

function unwrapUploadPayload(data: any): any {
  if (!data || typeof data !== "object") return data;
  return data.data || data.file || data.result || data.document || data;
}

export function normalizeUploadedFile(data: any): UploadedFileResult {
  const payload = unwrapUploadPayload(data);
  const nested = unwrapUploadPayload(payload);
  const candidates = [payload, nested, data].filter(Boolean);

  let documentId = "";
  let signedUrl = "";
  let url = "";
  let key = "";

  for (const item of candidates) {
    if (!item || typeof item !== "object") continue;

    if (!documentId) {
      documentId = String(
        item.documentId || item._id || item.id || item.docId || item.fileId || ""
      );
    }

    if (!signedUrl) {
      signedUrl = String(item.signedUrl || item.signed_url || "");
    }

    if (!url) {
      url = String(item.url || item.Location || item.location || signedUrl || "");
    }

    if (!key) {
      key = String(item.key || item.Key || "");
    }
  }

  if (!url && typeof data === "string") {
    url = data;
  }

  return {
    documentId,
    signedUrl: signedUrl || url,
    url: url || signedUrl,
    key: key || undefined,
    raw: data,
  };
}

export async function uploadAdminFile(
  file: File,
  documentType: string
): Promise<UploadedFileResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const res = await fetch(`${ADMIN_API_BASE_URL}/upload`, {
    method: "POST",
    headers: getAdminUploadHeaders(),
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(readApiError(data, `Upload failed (${res.status})`));
  }

  const normalized = normalizeUploadedFile(data);

  if (!normalized.documentId && !normalized.url && !normalized.signedUrl) {
    throw new Error("Upload succeeded but no file details were returned");
  }

  return normalized;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${ADMIN_API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(readApiError(data, "Invalid admin credentials"));
  }

  const accessToken =
    data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token;

  if (!accessToken) {
    throw new Error("Login failed: no access token received");
  }

  const admin: AdminUser = data?.admin || data?.data?.admin || { email };

  return { accessToken, admin };
}
