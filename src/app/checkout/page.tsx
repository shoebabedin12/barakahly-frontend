"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { trackInitiateCheckout } from "@/lib/tracking";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { IconChevronDown } from "@/components/icons";
import { FloatingInput, FloatingTextarea } from "@/components/FloatingField";
import { PasswordRequirements, passwordMeetsRequirements } from "@/components/PasswordRequirements";
import { ApiError } from "@/lib/api";
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
  const { customer, loading: authLoading } = useAuth();
  const authenticated = Boolean(customer);

  const [options, setOptions] = useState<CheckoutOptions | null>(null);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [bagOpen, setBagOpen] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [shippingZoneId, setShippingZoneId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartReady = Boolean(cart) && !cartLoading;
  useEffect(() => {
    if (cartReady && cart) trackInitiateCheckout(cart);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the cart first loads
  }, [cartReady]);

  useEffect(() => {
    getCheckoutOptions().then((data) => {
      setOptions(data);
      setPaymentMethodId(data.payment_methods[0]?.id ?? null);
      setShippingZoneId(data.shipping_zones[0]?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!customer) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from the async-loaded customer, same pattern as AuthProvider's initial auth check
    setName((v) => v || customer.name || "");
    setPhone((v) => v || customer.phone || "");
    setEmail((v) => v || customer.email || "");
    setAddress((v) => v || customer.address || "");
  }, [customer]);

  const coupon = getAppliedCoupon();
  const selectedPaymentMethod = options?.payment_methods.find((m) => m.id === paymentMethodId);
  const selectedShippingZone = options?.shipping_zones.find((z) => z.id === shippingZoneId);
  const shippingCharge = selectedShippingZone ? Number(selectedShippingZone.charge) : 0;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, (cart?.subtotal ?? 0) - discount) + shippingCharge;

  const step1Complete = Boolean(name && phone && address && (authenticated || verifyToken));

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

  function handleContinueStep1() {
    setError(null);
    if (!name || !phone || !address) {
      setError("Please fill in your name, phone, and shipping address.");
      return;
    }
    if (!authenticated && !verifyToken) {
      setError("Please verify your email address before continuing.");
      return;
    }
    if (!authenticated && !passwordMeetsRequirements(password, passwordConfirmation)) {
      setError("Please choose a password that meets all the requirements below.");
      return;
    }
    setActiveStep(2);
  }

  function handleContinueStep2() {
    setError(null);
    if (!shippingZoneId) {
      setError("Please select a shipping zone.");
      return;
    }
    setActiveStep(3);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!authenticated && !verifyToken) {
      setError("Please verify your email address before placing the order.");
      return;
    }
    if (!paymentMethodId || !shippingZoneId) {
      setError("Please select a payment method and shipping zone.");
      return;
    }
    if (selectedPaymentMethod?.requires_transaction_id && (!transactionId || !paymentDate)) {
      setError("Please enter the Transaction ID and payment date.");
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
        verify_token: verifyToken ?? undefined,
        transaction_id: selectedPaymentMethod?.requires_transaction_id ? transactionId : undefined,
        payment_date: selectedPaymentMethod?.requires_transaction_id ? paymentDate : undefined,
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

  if (cartLoading || !options || authLoading) {
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/cart" className="mb-4 inline-flex items-center gap-1 text-sm text-dark/50 hover:text-primary">
        &lsaquo; Checkout
      </Link>

      {paymentError && (
        <div className="mb-6 rounded-lg bg-danger/15 p-3 text-sm font-medium text-danger">{paymentError}</div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Step 1: Shipping Details */}
          <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  activeStep === 1 ? "bg-primary text-background" : "bg-black/10 text-dark/60 dark:bg-white/10"
                }`}
              >
                1
              </span>
              <span className="font-semibold text-dark">Shipping Details</span>
              {step1Complete && activeStep !== 1 && (
                <span className="ml-auto text-sm font-medium text-primary">Edit</span>
              )}
            </button>

            {activeStep === 1 && (
              <div className="border-t border-black/10 p-4 dark:border-white/10">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingInput label="Full name" required value={name} onChange={(e) => setName(e.target.value)} />

                  <FloatingInput label="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />

                  <div className="col-span-full flex gap-2">
                    <FloatingInput
                      label="Email"
                      type="email"
                      required
                      disabled={otpSent}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    {!authenticated && !verifyToken && (
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

                  {!authenticated && otpSent && !verifyToken && (
                    <div className="col-span-full flex gap-2">
                      <FloatingInput
                        label="Verification code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="flex-1"
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
                  )}

                  {!authenticated && otpMessage && <p className="col-span-full text-sm text-success">{otpMessage}</p>}

                  <FloatingTextarea
                    label="Shipping address"
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-full"
                  />

                  {!authenticated && (
                    <>
                      <FloatingInput
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <FloatingInput
                        label="Confirm password"
                        type="password"
                        required
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                      />

                      {password.length > 0 && (
                        <div className="col-span-full">
                          <PasswordRequirements password={password} confirmation={passwordConfirmation} />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {error && <p className="mt-3 text-sm text-danger">{error}</p>}

                <button
                  type="button"
                  onClick={handleContinueStep1}
                  className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background"
                >
                  Continue
                </button>
              </div>
            )}

            {activeStep !== 1 && step1Complete && (
              <div className="border-t border-black/10 p-4 text-sm text-dark/60 dark:border-white/10">
                <p className="font-medium text-dark">
                  {name} &middot; {phone}
                </p>
                <p>{address}</p>
              </div>
            )}
          </div>

          {/* Step 2: Shipping Method */}
          <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => step1Complete && setActiveStep(2)}
              disabled={!step1Complete}
              className="flex w-full items-center gap-3 p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  activeStep === 2 ? "bg-primary text-background" : "bg-black/10 text-dark/60 dark:bg-white/10"
                }`}
              >
                2
              </span>
              <span className="font-semibold text-dark">Shipping Method</span>
              {shippingZoneId && activeStep !== 2 && (
                <span className="ml-auto text-sm font-medium text-primary">Edit</span>
              )}
            </button>

            {activeStep === 2 && (
              <div className="border-t border-black/10 p-4 dark:border-white/10">
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

                {error && <p className="mt-3 text-sm text-danger">{error}</p>}

                <button
                  type="button"
                  onClick={handleContinueStep2}
                  className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background"
                >
                  Continue
                </button>
              </div>
            )}

            {activeStep !== 2 && shippingZoneId && selectedShippingZone && (
              <div className="border-t border-black/10 p-4 text-sm text-dark/60 dark:border-white/10">
                {selectedShippingZone.name} &middot; {selectedShippingZone.charge} &#2547;
              </div>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => step1Complete && shippingZoneId && setActiveStep(3)}
              disabled={!step1Complete || !shippingZoneId}
              className="flex w-full items-center gap-3 p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  activeStep === 3 ? "bg-primary text-background" : "bg-black/10 text-dark/60 dark:bg-white/10"
                }`}
              >
                3
              </span>
              <span className="font-semibold text-dark">Payment Method</span>
            </button>

            {activeStep === 3 && (
              <div className="border-t border-black/10 p-4 dark:border-white/10">
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

                {selectedPaymentMethod?.requires_transaction_id && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <FloatingInput
                      label="Transaction ID"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <FloatingInput
                      label="Payment Date"
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                )}

                {error && <p className="mt-3 text-sm text-danger">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background disabled:opacity-50"
                >
                  {submitting ? "Placing order..." : "Place order"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky-below-header hide-scrollbar flex flex-col gap-4">
            <div className="rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
              <h2 className="mb-3 font-semibold text-dark">Order Summary</h2>
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

            <div className="rounded-xl border border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setBagOpen((v) => !v)}
                className="flex w-full items-center justify-between p-4 text-sm font-semibold text-dark"
              >
                Your Bag ({cart.count})
                <IconChevronDown className={`h-4 w-4 transition-transform ${bagOpen ? "rotate-180" : ""}`} />
              </button>

              {bagOpen && (
                <div className="flex max-h-80 flex-col gap-3 overflow-y-auto border-t border-black/10 p-4 dark:border-white/10">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="line-clamp-1 font-medium text-dark">{item.name}</p>
                        <p className="text-xs text-dark/40">{item.sku}</p>
                        <p className="text-xs text-dark/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-primary">{item.subtotal.toFixed(0)} &#2547;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
