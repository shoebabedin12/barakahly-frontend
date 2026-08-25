"use client";

import { apiGet, apiPost } from "./api";
import { getGuestToken, setToken } from "./auth";
import type { Order } from "./types";

export function sendCheckoutOtp(email: string) {
  return apiPost<{ message: string }>("/api/v1/checkout/send-otp", { email }, { anonymous: true });
}

export function verifyCheckoutOtp(email: string, code: string) {
  return apiPost<{ message: string; verify_token: string }>("/api/v1/checkout/verify-otp", {
    email,
    code,
  });
}

export interface PlaceOrderPayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  payment_method_id: number;
  shipping_zone_id: number;
  coupon_code?: string;
  verify_token: string;
  transaction_id?: string;
  password?: string;
  password_confirmation?: string;
}

export async function placeOrder(payload: PlaceOrderPayload) {
  const response = await apiPost<{ order: Order; token: string | null }>(
    "/api/v1/checkout",
    payload as unknown as Record<string, unknown>
  );

  if (response.token) {
    setToken(response.token);
  }

  return response.order;
}

export async function initSslcommerzPayment(orderId: number) {
  const { gateway_url } = await apiGet<{ gateway_url: string }>(
    `/api/v1/payment/sslcommerz/init/${orderId}`
  );
  window.location.href = gateway_url;
}

export function currentGuestToken() {
  return getGuestToken();
}
