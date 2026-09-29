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
import { QuickViewDrawer } from "@/components/QuickViewDrawer";
import { QuickViewProvider } from "@/components/QuickViewProvider";
import { getCategories, getSettings } from "@/lib/queries";

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
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
