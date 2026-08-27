"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getSettings } from "@/lib/queries";
import { sendContactMessage } from "@/lib/site";
import type { Settings } from "@/lib/types";
import { IconChatBubble, IconEnvelope, IconMapPin, IconPhone } from "@/components/icons";

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await sendContactMessage({ name, email, phone: phone || undefined, message });
      setSuccess(res.message);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="mb-2 text-3xl font-bold text-dark">Contact Us</h1>
      <p className="mb-8 text-sm text-dark/50">
        Have a question about an order or product? Send us a message and we&apos;ll get back to you soon.
      </p>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark">Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-black/10 p-3 text-sm focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark">Phone (optional)</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-black/10 p-3 text-sm focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-black/10 p-3 text-sm focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-black/10 p-3 text-sm focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                />
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}
              {success && <p className="text-sm text-success">{success}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="mb-4 text-lg font-bold text-dark">Get in Touch</h2>

            <div className="space-y-4 text-sm">
              {settings?.contact_phone && (
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-background p-2.5 text-primary">
                    <IconPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark/50">Phone</p>
                    <p className="font-medium text-dark">{settings.contact_phone}</p>
                  </div>
                </div>
              )}

              {settings?.contact_email && (
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-background p-2.5 text-primary">
                    <IconEnvelope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark/50">Email</p>
                    <p className="font-medium text-dark">{settings.contact_email}</p>
                  </div>
                </div>
              )}

              {settings?.address && (
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-background p-2.5 text-primary">
                    <IconMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-dark/50">Address</p>
                    <p className="font-medium text-dark">{settings.address}</p>
                  </div>
                </div>
              )}

              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2.5 text-sm font-medium text-success transition hover:bg-success/20"
                >
                  <IconChatBubble className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
