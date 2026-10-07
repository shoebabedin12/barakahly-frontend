"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCheckoutOptions } from "@/lib/queries";
import { ApiError } from "@/lib/api";
import { subscribeNewsletter } from "@/lib/site";
import type { Category, Settings } from "@/lib/types";
import { IconEnvelope, IconMapPin, IconPhone } from "./icons";

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.13 0 2.72-.01 3.06-.06 4.12-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76c-.5.5-1.1.9-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06-2.73 0-3.07-.01-4.13-.06-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12c0-2.73.01-3.07.06-4.13.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44 2.53c.64-.25 1.37-.42 2.43-.47C8.93 2.01 9.27 2 12 2Zm0 1.8c-2.68 0-3 .01-4.05.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.3.3-.5.6-.66 1.02-.12.31-.26.78-.3 1.65C4.27 8.14 4.26 8.5 4.26 12s.01 3.86.06 4.86c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.3.3.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.05.06 2.68 0 3-.01 4.05-.06.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.3-.3.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1 .06-1.37.06-4.86s-.01-3.86-.06-4.86c-.04-.87-.18-1.34-.3-1.65a2.75 2.75 0 0 0-.66-1.02 2.75 2.75 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3C15 4.27 14.68 4.26 12 4.26v-.46Zm0 3.44a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm5.9-1.99a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 7.2s-.21-1.5-.86-2.16c-.82-.87-1.74-.87-2.16-.92C15.6 4 12 4 12 4h-.01s-3.6 0-6.58.12c-.42.05-1.34.05-2.16.92C2.6 5.7 2.4 7.2 2.4 7.2S2.19 8.95 2.19 10.7v1.6c0 1.75.21 3.5.21 3.5s.2 1.5.85 2.16c.82.87 1.9.84 2.38.93 1.73.17 7.37.22 7.37.22s3.6-.01 6.59-.13c.42-.05 1.34-.05 2.16-.92.65-.66.86-2.16.86-2.16s.21-1.75.21-3.5v-1.6c0-1.75-.21-3.5-.21-3.5ZM9.99 14.5V8.9l5.4 2.81-5.4 2.8Z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.36-1.31a9.9 9.9 0 0 0 4.68 1.19h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.24c-.25.7-1.24 1.29-1.98 1.44-.53.11-1.22.2-3.55-.76-2.98-1.23-4.9-4.22-5.05-4.42-.15-.2-1.2-1.6-1.2-3.05s.76-2.17 1.03-2.46c.25-.28.55-.35.73-.35.19 0 .37 0 .53.01.17.01.4-.06.63.48.24.56.8 1.95.87 2.09.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.16-.3.36-.42.48-.14.15-.29.3-.13.6.17.3.75 1.25 1.62 2.02 1.11 1 2.05 1.31 2.34 1.46.29.15.46.13.63-.08.17-.2.72-.85.91-1.14.19-.29.38-.24.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.13.07.71-.18 1.4Z" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  if (links.length === 0) return null;

  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">{title}</h4>
      <ul className="space-y-2.5 text-sm text-background/70">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-secondary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ settings, categories }: { settings: Settings | null; categories: Category[] }) {
  const year = new Date().getFullYear();
  const hasSocial = settings?.facebook || settings?.instagram || settings?.youtube || settings?.whatsapp;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  useEffect(() => {
    getCheckoutOptions()
      .then((options) => setPaymentMethods(options.payment_methods.map((m) => m.name)))
      .catch(() => {});
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const res = await subscribeNewsletter(email);
      setMessage(res.message);
      setEmail("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not subscribe right now.");
    } finally {
      setSubmitting(false);
    }
  }

  const topLevelCategories = categories.slice(0, 7);

  return (
    <footer className="brand-band mt-24 bg-primary text-background">
      <div className="h-1 bg-linear-to-r from-secondary via-secondary/40 to-secondary" />

      <div className="border-b border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex w-full items-center gap-4 lg:w-auto">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <IconEnvelope className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold">Get Offers in Your Inbox</h3>
              <p className="mt-1 text-sm text-background/60">Subscribe for promotions, new arrivals, and exclusive discounts.</p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-background/20 bg-background/10 px-4 py-3 text-sm text-background placeholder:text-background/50 focus:border-secondary focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-dark transition hover:opacity-90 disabled:opacity-50"
              >
                Subscribe
              </button>
            </div>
            {error && <p className="mt-2 text-left text-xs text-danger">{error}</p>}
            {message && <p className="mt-2 text-left text-xs text-secondary">{message}</p>}
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          {settings?.site_logo ? (
            <div className="relative inline-flex h-12 w-32 rounded-xl bg-background/95 px-3 py-2">
              <Image
                src={settings.site_logo}
                alt={settings.site_name}
                fill
                sizes="128px"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <h3 className="text-lg font-bold">{settings?.site_name ?? "Barakahly"}</h3>
          )}

          <p className="mt-3 text-sm leading-relaxed text-background/60">
            {settings?.meta_description || "Quality products, delivered across Bangladesh."}
          </p>

          <ul className="mt-4 space-y-2.5 text-sm text-background/70">
            {settings?.address && (
              <li className="flex items-start gap-2.5">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings?.contact_phone && (
              <li className="flex items-start gap-2.5">
                <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`tel:${settings.contact_phone}`} className="hover:text-secondary">{settings.contact_phone}</a>
              </li>
            )}
            {settings?.contact_email && (
              <li className="flex items-start gap-2.5">
                <IconEnvelope className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <a href={`mailto:${settings.contact_email}`} className="break-all hover:text-secondary">{settings.contact_email}</a>
              </li>
            )}
          </ul>

          {hasSocial && (
            <div className="mt-5 flex items-center gap-2.5">
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener" title="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition hover:-translate-y-0.5 hover:bg-secondary hover:text-dark">
                  <FacebookIcon />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener" title="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition hover:-translate-y-0.5 hover:bg-secondary hover:text-dark">
                  <InstagramIcon />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener" title="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition hover:-translate-y-0.5 hover:bg-secondary hover:text-dark">
                  <YoutubeIcon />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" title="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition hover:-translate-y-0.5 hover:bg-secondary hover:text-dark">
                  <WhatsappIcon />
                </a>
              )}
            </div>
          )}
        </div>

        <FooterColumn
          title="Information"
          links={[
            { label: "Home", href: "/" },
            { label: "Contact Us", href: "/contact" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms & Conditions", href: "/terms-and-conditions" },
          ]}
        />

        <FooterColumn
          title="Shop By"
          links={topLevelCategories.map((category) => ({
            label: category.name,
            href: `/products?category=${category.slug}`,
          }))}
        />

        <FooterColumn
          title="Support"
          links={[
            { label: "Contact Us", href: "/contact" },
            { label: "My Account", href: "/account" },
            { label: "My Orders", href: "/account/orders" },
            { label: "Wishlist", href: "/account/wishlist" },
          ]}
        />

        <FooterColumn
          title="Consumer Policy"
          links={[
            { label: "Refund Policy", href: "/refund-policy" },
            { label: "Terms & Conditions", href: "/terms-and-conditions" },
            { label: "Privacy Policy", href: "/privacy-policy" },
          ]}
        />
      </div>

      {paymentMethods.length > 0 && (
        <div className="border-t border-background/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6">
            <span className="text-xs text-background/50">
              &copy; {year} {settings?.site_name ?? "Barakahly"}. All rights reserved.
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-background/50">Pay With</span>
              {paymentMethods.map((name) => (
                <span key={name} className="rounded-full bg-background/10 px-3.5 py-1.5 text-xs font-medium text-background/80">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-background/10 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center text-xs text-background/50 sm:flex-row sm:gap-4">
          <Link href="/privacy-policy" className="hover:text-secondary">Privacy Policy</Link>
          <span className="hidden sm:inline">&middot;</span>
          <Link href="/terms-and-conditions" className="hover:text-secondary">Terms &amp; Conditions</Link>
          <span className="hidden sm:inline">&middot;</span>
          <Link href="/refund-policy" className="hover:text-secondary">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
