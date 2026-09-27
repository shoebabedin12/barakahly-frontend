"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { IconFingerprint, IconLock, IconUser } from "@/components/icons";
import { FloatingInput } from "@/components/FloatingField";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/authApi";
import { loginWithPasskey } from "@/lib/passkeyApi";
import { PasskeyError, isPasskeySupported } from "@/lib/webauthn";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-md px-4 py-16 text-center text-dark/60">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const { refreshAuth } = useAuth();
  const { refreshCart } = useCart();

  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeySubmitting, setPasskeySubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser feature check on mount, same pattern as AuthProvider's initial auth check
    setPasskeySupported(isPasskeySupported());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(loginField, password);
      await Promise.all([refreshAuth(), refreshCart()]);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasskeyLogin() {
    setPasskeySubmitting(true);
    setError(null);
    try {
      await loginWithPasskey();
      await Promise.all([refreshAuth(), refreshCart()]);
      router.push(redirectTo);
    } catch (err) {
      setError(
        err instanceof PasskeyError || err instanceof ApiError
          ? err.message
          : "Could not sign in with a passkey. Please try again."
      );
    } finally {
      setPasskeySubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 dark:bg-white/5 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconLock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-dark">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-dark/60">Login to track orders, manage your wishlist, and checkout faster.</p>
        </div>

        {passkeySupported && (
          <>
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={passkeySubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-50"
            >
              <IconFingerprint className="h-5 w-5" />
              {passkeySubmitting ? "Waiting for passkey..." : "Sign in with a Passkey"}
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              <span className="text-xs font-medium uppercase text-dark/40">or</span>
              <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FloatingInput
            label="Email or Phone"
            required
            autoFocus
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
            icon={IconUser}
          />

          <FloatingInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={IconLock}
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-dark/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
