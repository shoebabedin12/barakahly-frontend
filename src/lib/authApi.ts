"use client";

import { apiPost } from "./api";
import { clearGuestToken, getGuestToken, setToken } from "./auth";
import type { Customer } from "./types";

interface AuthResponse {
  token: string;
  customer: Customer;
}

export async function login(loginField: string, password: string) {
  const response = await apiPost<AuthResponse>(
    "/api/v1/auth/login",
    { login: loginField, password, guest_token: getGuestToken() ?? undefined },
    { anonymous: true }
  );

  setToken(response.token);
  clearGuestToken();

  return response.customer;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  password: string;
  password_confirmation: string;
}

export async function register(payload: RegisterPayload) {
  const response = await apiPost<AuthResponse>(
    "/api/v1/auth/register",
    { ...payload, guest_token: getGuestToken() ?? undefined },
    { anonymous: true }
  );

  setToken(response.token);
  clearGuestToken();

  return response.customer;
}

export async function logout() {
  await apiPost("/api/v1/auth/logout");
  setToken(null);
}
