import type { Metadata } from "next";
import Image from "next/image";
import { AppQrCode } from "@/components/AppQrCode";

export const metadata: Metadata = {
  title: "Barakahly App for Android",
  description: "Shop Barakahly on your phone - faster checkout, order tracking and your wishlist in one app.",
};

const APK_URL = "/downloads/barakahly-1.0.0.apk";

const FEATURES = [
  "Browse every category and new arrival",
  "Cash on delivery and bKash checkout",
  "Track your orders and save a wishlist",
  "Light and dark mode",
];

export default function AppPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image src="/app-icon.png" alt="Barakahly app icon" width={112} height={112} className="rounded-[28px] shadow-xl" priority />
        <div>
          <h1 className="text-3xl font-extrabold text-dark sm:text-4xl">Barakahly for Android</h1>
          <p className="mt-3 text-dark/60">Faith, quality and barakah in every purchase - now in your pocket.</p>
        </div>

        <a
          href={APK_URL}
          className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />
          </svg>
          Download the app (APK, 89 MB)
        </a>
        <p className="text-xs text-dark/40">Version 1.0.0 · Android 7.0 or newer · Google Play and App Store coming soon</p>

        {/* On a computer: scan to open this page on the phone. */}
        <div className="mt-4 hidden items-center gap-5 rounded-2xl border border-black/10 bg-white p-5 text-left sm:flex dark:border-white/10 dark:bg-white/5">
          <AppQrCode size={140} />
          <div>
            <p className="font-bold text-dark">On your computer?</p>
            <p className="mt-1 max-w-xs text-sm text-dark/60">
              Point your phone&apos;s camera at the code to open this page there, then tap Download.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-bold text-dark">What you get</h2>
          <ul className="mt-3 space-y-2 text-sm text-dark/70">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-secondary">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-bold text-dark">How to install</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-dark/70">
            <li>Tap the download button on your Android phone.</li>
            <li>Open the downloaded file. If asked, allow installs from your browser.</li>
            <li>Tap Install, then open Barakahly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
