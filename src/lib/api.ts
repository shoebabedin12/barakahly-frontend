import { getGuestToken, getToken, setGuestToken } from "./auth";
import type { ApiErrorBody } from "./types";

const SERVER_BASE_URL =
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const BROWSER_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || "Something went wrong. Please try again.");
    this.status = status;
    this.errors = body.errors;
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Skip auth/guest-token headers (rarely needed - most endpoints are fine either way). */
  anonymous?: boolean;
}

/**
 * Shared fetch wrapper for /api/v1/*. Works from both Server Components
 * (calls Laravel directly, server-to-server, no CORS involved) and Client
 * Components (calls the public API URL, attaches the Bearer token and/or
 * X-Guest-Token, and persists any guest_token the response echoes back).
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? SERVER_BASE_URL : BROWSER_BASE_URL;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!options.anonymous && !isServer) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      const guestToken = getGuestToken();
      if (guestToken) {
        headers.set("X-Guest-Token", guestToken);
      }
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(response.status, body ?? { message: response.statusText });
  }

  if (!isServer && body && typeof body === "object" && "guest_token" in body) {
    const token = (body as { guest_token?: string | null }).guest_token;
    if (token) setGuestToken(token);
  }

  return body as T;
}

export function apiGet<T>(path: string, options?: ApiFetchOptions) {
  return apiFetch<T>(path, { ...options, method: "GET" });
}

export function apiPost<T>(path: string, data?: Record<string, unknown>, options?: ApiFetchOptions) {
  return apiFetch<T>(path, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiPatch<T>(path: string, data?: Record<string, unknown>, options?: ApiFetchOptions) {
  return apiFetch<T>(path, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiDelete<T>(path: string, options?: ApiFetchOptions) {
  return apiFetch<T>(path, { ...options, method: "DELETE" });
}
