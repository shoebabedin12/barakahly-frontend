import Image from "next/image";

/**
 * QR code that opens barakahly.com/app (the Android download page) on a
 * phone, with the app icon in the middle. The code uses the highest error
 * correction, so the icon covering its centre doesn't stop it scanning.
 */
export function AppQrCode({ size = 160, className = "" }: { size?: number; className?: string }) {
  const icon = Math.round(size * 0.22);
  return (
    <div className={`relative shrink-0 rounded-2xl bg-white p-2 shadow-sm ${className}`} style={{ width: size + 16, height: size + 16 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
      <img src="/app-qr.svg" alt="QR code: scan to download the Barakahly app" width={size} height={size} className="block" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-1"
        style={{ width: icon + 8, height: icon + 8 }}
      >
        <Image src="/app-icon.png" alt="" width={icon} height={icon} className="rounded-lg" />
      </div>
    </div>
  );
}
