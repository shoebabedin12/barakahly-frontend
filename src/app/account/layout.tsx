"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountSidebar } from "@/components/AccountSidebar";
import { useAuth } from "@/components/AuthProvider";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { customer, loading } = useAuth();

  useEffect(() => {
    if (!loading && !customer) {
      router.replace("/login?redirect=/account");
    }
  }, [loading, customer, router]);

  if (loading || !customer) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-center text-dark/60">Loading account...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-4">
        <AccountSidebar />
        <div className="space-y-6 md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
