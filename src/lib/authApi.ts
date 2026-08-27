"use client";

import { apiPatch, apiPost } from "./api";
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

export interface ProfilePayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
}

export async function updateProfile(payload: ProfilePayload) {
  const response = await apiPatch<{ customer: Customer }>("/api/v1/auth/profile", { ...payload });
  return response.customer;
}

export interface PasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export function updatePassword(payload: PasswordPayload) {
  return apiPatch<{ message: string }>("/api/v1/auth/password", { ...payload });
}
