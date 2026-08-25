"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ApiError } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { placeOrder, sendCheckoutOtp, verifyCheckoutOtp, initSslcommerzPayment } from "@/lib/checkout";
import { getAppliedCoupon, setAppliedCoupon } from "@/lib/coupon";
import { getCheckoutOptions } from "@/lib/queries";
import type { CheckoutOptions } from "@/lib/types";

const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  failed: "Payment failed. Please try again.",
  cancelled: "Payment was cancelled.",
  invalid: "Invalid or expired payment session.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-3xl px-4 py-16 text-center text-dark/60">Loading checkout...</p>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentError = PAYMENT_ERROR_MESSAGES[searchParams.get("payment") ?? ""];
  const { cart, loading: cartLoading, refreshCart } = useCart();

  const [options, setOptions] = useState<CheckoutOptions | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [shippingZoneId, setShippingZoneId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a client-only localStorage value on mount
    setAuthenticated(isAuthenticated());
    getCheckoutOptions().then((data) => {
      setOptions(data);
      setPaymentMethodId(data.payment_methods[0]?.id ?? null);
      setShippingZoneId(data.shipping_zones[0]?.id ?? null);
    });
  }, []);

  const coupon = getAppliedCoupon();
  const selectedPaymentMethod = options?.payment_methods.find((m) => m.id === paymentMethodId);
  const selectedShippingZone = options?.shipping_zones.find((z) => z.id === shippingZoneId);
  const shippingCharge = selectedShippingZone ? Number(selectedShippingZone.charge) : 0;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, (cart?.subtotal ?? 0) - discount) + shippingCharge;

  async function handleSendOtp() {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setOtpBusy(true);
    setError(null);
    try {
      await sendCheckoutOtp(email);
      setOtpSent(true);
      setOtpMessage("Verification code sent to your email.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send verification code.");
    } finally {
      setOtpBusy(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpCode) return;
    setOtpBusy(true);
    setError(null);
    try {
      const result = await verifyCheckoutOtp(email, otpCode);
      setVerifyToken(result.verify_token);
      setOtpMessage("Email verified.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setOtpBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!verifyToken) {
      setError("Please verify your email address before placing the order.");
      return;
    }
    if (!paymentMethodId || !shippingZoneId) {
      setError("Please select a payment method and shipping zone.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await placeOrder({
        name,
        phone,
        email,
        address,
        payment_method_id: paymentMethodId,
        shipping_zone_id: shippingZoneId,
        coupon_code: coupon?.code,
        verify_token: verifyToken,
        transaction_id: selectedPaymentMethod?.code && transactionId ? transactionId : undefined,
        password: authenticated ? undefined : password,
        password_confirmation: authenticated ? undefined : passwordConfirmation,
      });

      setAppliedCoupon(null);
      await refreshCart();

      if (selectedPaymentMethod?.code === "sslcommerz") {
        await initSslcommerzPayment(order.id);
        return;
      }

      router.push(`/order-success/${order.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not place the order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cartLoading || !options) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-dark/60">Loading checkout...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-dark/60">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-dark">Checkout</h1>

      {paymentError && (
        <div className="mb-6 rounded-lg bg-danger/15 p-3 text-sm font-medium text-danger">{paymentError}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Phone
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
            />
          </label>

          <label className="col-span-full flex flex-col gap-1 text-sm">
            Email
            <div className="flex gap-2">
              <input
                required
                type="email"
                value={email}
                disabled={otpSent}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
              />
              {!verifyToken && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpBusy || otpSent}
                  className="shrink-0 rounded-lg border border-primary px-3 text-sm font-semibold text-primary disabled:opacity-50"
                >
                  {otpSent ? "Code sent" : "Send code"}
                </button>
              )}
            </div>
          </label>

          {otpSent && !verifyToken && (
            <label className="col-span-full flex flex-col gap-1 text-sm">
              Verification code
              <div className="flex gap-2">
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpBusy}
                  className="shrink-0 rounded-lg bg-primary px-3 text-sm font-semibold text-background disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </label>
          )}

          {otpMessage && <p className="col-span-full text-sm text-success">{otpMessage}</p>}

          <label className="col-span-full flex flex-col gap-1 text-sm">
            Shipping address
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
            />
          </label>

          {!authenticated && (
            <>
              <label className="flex flex-col gap-1 text-sm">
                Password
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Confirm password
                <input
                  required
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                />
              </label>
            </>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-dark">Shipping zone</p>
          <div className="flex flex-wrap gap-2">
            {options.shipping_zones.map((zone) => (
              <button
                type="button"
                key={zone.id}
                onClick={() => setShippingZoneId(zone.id)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  shippingZoneId === zone.id
                    ? "border-primary bg-primary text-background"
                    : "border-black/15 dark:border-white/20"
                }`}
              >
                {zone.name} &middot; {zone.charge} &#2547;
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-dark">Payment method</p>
          <div className="flex flex-col gap-2">
            {options.payment_methods.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm ${
                  paymentMethodId === method.id ? "border-primary" : "border-black/15 dark:border-white/20"
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethodId === method.id}
                    onChange={() => setPaymentMethodId(method.id)}
                  />
                  {method.name}
                </span>
                {method.instructions && <span className="text-dark/60">{method.instructions}</span>}
              </label>
            ))}
          </div>

          {selectedPaymentMethod && selectedPaymentMethod.code !== "cod" && selectedPaymentMethod.code !== "sslcommerz" && (
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Transaction ID
              <input
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
              />
            </label>
          )}
        </div>

        <div className="rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{cart.subtotal.toFixed(0)} &#2547;</span>
          </div>
          {discount > 0 && (
            <div className="mt-1 flex items-center justify-between text-success">
              <span>Discount</span>
              <span>-{discount.toFixed(0)} &#2547;</span>
            </div>
          )}
          <div className="mt-1 flex items-center justify-between">
            <span>Shipping</span>
            <span>{shippingCharge.toFixed(0)} &#2547;</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 text-base font-semibold dark:border-white/10">
            <span>Total</span>
            <span>{total.toFixed(0)} &#2547;</span>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !verifyToken}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background disabled:opacity-50"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
