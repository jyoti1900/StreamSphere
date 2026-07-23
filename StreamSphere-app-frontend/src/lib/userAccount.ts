import { API_BASE_URL } from "@/lib/apiConfig";

type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
};

function readApiError(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  const message = record.message;

  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message) return message;
  if (typeof record.error === "string" && record.error) return record.error;

  return fallback;
}

export async function updateUserProfile(
  accessToken: string,
  payload: UpdateProfilePayload
) {
  const res = await fetch(`${API_BASE_URL}/users/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(readApiError(data, `Update failed (${res.status})`));
  }

  return data;
}

