import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/queries";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description ?? undefined,
    };
  } catch {
    return { title: "Barakahly" };
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings().catch(() => null);

  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-dark">
        <CartProvider>
          <Header siteName={settings?.site_name ?? "Barakahly"} logo={settings?.site_logo ?? null} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
