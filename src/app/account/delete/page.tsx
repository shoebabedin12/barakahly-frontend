"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { ApiError, apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

/** Account deletion - also the public "delete your data" link given to the app stores. */
export default function DeleteAccountPage() {
  const router = useRouter();
  const { setCustomer } = useAuth();
  const { refreshCart } = useCart();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiFetch<{ message: string }>("/api/v1/auth/account", {
        method: "DELETE",
        body: JSON.stringify({ password }),
      });
      setToken(null);
      setCustomer(null);
      await refreshCart();
      router.push("/?account=deleted");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete your account. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-sm bg-black/2 dark:bg-white/5">
      <h1 className="border-b border-black/10 bg-black/2 px-6 py-7 text-2xl font-medium text-dark sm:px-10 dark:border-white/10">
        Delete Account
      </h1>

      <form onSubmit={handleDelete} className="flex max-w-lg flex-col gap-5 px-6 py-7 sm:px-10">
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-dark/80">
          <p className="font-semibold text-dark">This permanently removes:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your name, phone, email and address</li>
            <li>Your profile photo, cart, wishlist and reviews</li>
            <li>Your sign-in on every device, including the Barakahly app</li>
          </ul>
          <p className="mt-3 text-dark/60">
            Past orders are kept for our delivery and accounting records but are no longer linked to you. This
            can&apos;t be undone.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-dark">
          Your password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="h-12 rounded-sm border border-black/10 bg-white px-4 text-base outline-none focus:border-danger dark:border-white/10 dark:bg-white/5"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-dark">
          Type DELETE to confirm
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-12 rounded-sm border border-black/10 bg-white px-4 text-base uppercase outline-none focus:border-danger dark:border-white/10 dark:bg-white/5"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={busy || confirm.trim().toUpperCase() !== "DELETE"}
          className="w-fit rounded-sm bg-danger px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Deleting..." : "Delete my account"}
        </button>
      </form>
    </section>
  );
}
