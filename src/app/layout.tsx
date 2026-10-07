import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TrackingScripts } from "@/components/TrackingScripts";
import { QuickViewDrawer } from "@/components/QuickViewDrawer";
import { QuickViewProvider } from "@/components/QuickViewProvider";
import { getCategories, getSettings } from "@/lib/queries";

// Every page reads live catalog data (prices, stock, settings) from the API,
// so render per request instead of freezing a build-time snapshot. Server-side
// GETs are still cached briefly in apiFetch to keep load off the API.
export const dynamic = "force-dynamic";

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
      // The favicon uploaded in Admin -> Settings -> Branding.
      icons: settings.site_favicon
        ? { icon: settings.site_favicon, shortcut: settings.site_favicon, apple: settings.site_favicon }
        : undefined,
    };
  } catch {
    return { title: "Barakahly" };
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, categories] = await Promise.all([
    getSettings().catch(() => null),
    getCategories().catch(() => []),
  ]);

  return (
    // THEME_INIT_SCRIPT adds the dark/light class to <html> before hydration,
    // so its className intentionally differs from the server render.
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-dark">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <QuickViewProvider>
                <Header settings={settings} categories={categories} />
                <main className="flex-1">{children}</main>
                <div className="pb-16 sm:pb-0">
                  <Footer settings={settings} categories={categories} />
                </div>
                <MobileBottomNav />
                <CartDrawer />
                <QuickViewDrawer />
              </QuickViewProvider>
              <TrackingScripts settings={settings} />
              <ScrollReveal />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
