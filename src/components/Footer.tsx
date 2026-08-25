import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-black/10 bg-primary text-background dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">{settings?.site_name ?? "Barakahly"}</p>
            {settings?.address && <p className="mt-2 text-sm opacity-80">{settings.address}</p>}
          </div>

          <div>
            <p className="font-semibold">Contact</p>
            <ul className="mt-2 space-y-1 text-sm opacity-80">
              {settings?.contact_phone && <li>{settings.contact_phone}</li>}
              {settings?.contact_email && <li>{settings.contact_email}</li>}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Shop</p>
            <ul className="mt-2 space-y-1 text-sm opacity-80">
              <li>
                <Link href="/products" className="hover:underline">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:underline">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs opacity-70">
          &copy; {year} {settings?.site_name ?? "Barakahly"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
