const TOKEN_KEY = "barakahly_token";
const GUEST_TOKEN_KEY = "barakahly_guest_token";

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // storage unavailable (private mode, disabled cookies, etc.) - no-op
  }
}

export function getToken(): string | null {
  return readStorage(TOKEN_KEY);
}

export function setToken(token: string | null) {
  writeStorage(TOKEN_KEY, token);
}

export function getGuestToken(): string | null {
  return readStorage(GUEST_TOKEN_KEY);
}

export function setGuestToken(token: string | null) {
  writeStorage(GUEST_TOKEN_KEY, token);
}

/** Called after a successful login/register so the merged guest cart's local token is dropped. */
export function clearGuestToken() {
  writeStorage(GUEST_TOKEN_KEY, null);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function logout() {
  setToken(null);
}
