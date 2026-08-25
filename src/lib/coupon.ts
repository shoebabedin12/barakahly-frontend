"use client";

const COUPON_KEY = "barakahly_coupon";

export interface AppliedCoupon {
  code: string;
  discount: number;
}

export function getAppliedCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COUPON_KEY);
    return raw ? (JSON.parse(raw) as AppliedCoupon) : null;
  } catch {
    return null;
  }
}

export function setAppliedCoupon(coupon: AppliedCoupon | null) {
  if (typeof window === "undefined") return;
  try {
    if (coupon) {
      window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    } else {
      window.localStorage.removeItem(COUPON_KEY);
    }
  } catch {
    // ignore storage errors
  }
}
