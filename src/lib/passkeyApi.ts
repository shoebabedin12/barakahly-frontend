"use client";

import { apiDelete, apiGet, apiPost } from "./api";
import { clearGuestToken, getGuestToken, setToken } from "./auth";
import { createPasskeyCredential, getPasskeyCredential } from "./webauthn";
import type { Customer } from "./types";

export interface Passkey {
  id: number;
  name: string;
  authenticator: string | null;
  created_at: string | null;
  last_used_at: string | null;
}

interface OptionsResponse {
  ticket: string;
  options: Record<string, unknown>;
}

interface AuthResponse {
  token: string;
  customer: Customer;
}

/** Signs the visitor in with a passkey already registered on this device - no login field needed. */
export async function loginWithPasskey() {
  const { ticket, options } = await apiPost<OptionsResponse>(
    "/api/v1/auth/passkeys/login-options",
    undefined,
    { anonymous: true }
  );

  const credential = await getPasskeyCredential(options);

  const response = await apiPost<AuthResponse>(
    "/api/v1/auth/passkeys/login",
    { ticket, credential, guest_token: getGuestToken() ?? undefined },
    { anonymous: true }
  );

  setToken(response.token);
  clearGuestToken();

  return response.customer;
}

/** Registers a new passkey for the already-logged-in customer (e.g. from account settings). */
export async function registerPasskey(name: string) {
  const { ticket, options } = await apiPost<OptionsResponse>("/api/v1/auth/passkeys/register-options");

  const credential = await createPasskeyCredential(options);

  const response = await apiPost<{ passkey: Passkey }>("/api/v1/auth/passkeys/register", {
    ticket,
    name,
    credential,
  });

  return response.passkey;
}

export function listPasskeys() {
  return apiGet<{ passkeys: Passkey[] }>("/api/v1/auth/passkeys").then((res) => res.passkeys);
}

export function deletePasskey(id: number) {
  return apiDelete<{ message: string }>(`/api/v1/auth/passkeys/${id}`);
}
