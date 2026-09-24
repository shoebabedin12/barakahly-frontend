"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { IconEnvelope, IconLock, IconPhone, IconUser } from "@/components/icons";
import { FloatingInput, FloatingTextarea } from "@/components/FloatingField";
import { PasswordRequirements, passwordMeetsRequirements } from "@/components/PasswordRequirements";
import { ApiError } from "@/lib/api";
import { register } from "@/lib/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const { refreshCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({
        name,
        phone,
        email: email || undefined,
        address: address || undefined,
        password,
        password_confirmation: passwordConfirmation,
      });
      await Promise.all([refreshAuth(), refreshCart()]);
      router.push("/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 dark:bg-white/5 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconUser className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-dark">Create Your Account</h1>
          <p className="mt-1.5 text-sm text-dark/60">
            Join us to track orders, save your wishlist, and check out faster next time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FloatingInput label="Name" required autoFocus value={name} onChange={(e) => setName(e.target.value)} />

          <FloatingInput label="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} icon={IconPhone} />

          <FloatingInput
            label="Email (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={IconEnvelope}
          />

          <FloatingTextarea label="Address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />

          <FloatingInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={IconLock}
          />

          <FloatingInput
            label="Confirm Password"
            type="password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            icon={IconLock}
          />

          {password.length > 0 && (
            <PasswordRequirements password={password} confirmation={passwordConfirmation} />
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !passwordMeetsRequirements(password, passwordConfirmation)}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-dark/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
