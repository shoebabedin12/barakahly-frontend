"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { IconLock, IconUser } from "@/components/icons";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/authApi";

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark">Email or Phone</label>
            <div className="relative">
              <IconUser className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-dark/40" />
              <input
                required
                autoFocus
                value={loginField}
                onChange={(e) => setLoginField(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm text-dark focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark">Password</label>
            <div className="relative">
              <IconLock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-dark/40" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm text-dark focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
              />
            </div>
          </div>

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
