"use client";

import { useState } from "react";
import { AccountAvatar } from "@/components/AccountSidebar";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { updateProfile } from "@/lib/authApi";

function IconPencilSquare({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.86 4.49 1.69-1.69a1.88 1.88 0 1 1 2.65 2.65L10.58 16.07a4.5 4.5 0 0 1-1.9 1.13L6 18l.8-2.68a4.5 4.5 0 0 1 1.13-1.9l8.93-8.93Zm0 0L19.5 7.13M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

function FlagBD({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 30" className={className} aria-label="Bangladesh">
      <rect width="50" height="30" rx="3" fill="#006a4e" />
      <circle cx="22" cy="15" r="9" fill="#f42a41" />
    </svg>
  );
}

const fieldBoxClass =
  "flex h-14 w-full items-center gap-4 rounded-sm border border-black/5 bg-white px-5 text-[15px] text-dark/70 dark:border-white/10 dark:bg-white/5";

const inputClass =
  `${fieldBoxClass} text-dark outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-base font-medium text-dark">{label}</span>
      {children}
    </div>
  );
}

export default function AccountProfilePage() {
  const { customer, refreshAuth } = useAuth();

  const [editing, setEditing] = useState(false);
  // AccountLayout only renders this page once `customer` has loaded, so these
  // initial values are always populated on first render.
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [address, setAddress] = useState(customer?.address ?? "");
  const [city, setCity] = useState(customer?.city ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!customer) return null;

  function startEditing() {
    setSuccess(null);
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setName(customer?.name ?? "");
    setPhone(customer?.phone ?? "");
    setEmail(customer?.email ?? "");
    setAddress(customer?.address ?? "");
    setCity(customer?.city ?? "");
    setError(null);
    setEditing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateProfile({ name, phone, email: email || undefined, address: address || undefined, city: city || undefined });
      await refreshAuth();
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-sm bg-black/2 dark:bg-white/5">
      <h1 className="border-b border-black/10 bg-black/2 px-6 py-7 text-2xl font-medium text-dark sm:px-10 dark:border-white/10">
        Personal Information
      </h1>

      <form onSubmit={handleSubmit} className="px-6 py-7 sm:px-10">
        <div className="mb-7 flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <div className="relative">
            <AccountAvatar name={customer.name} className="h-32 w-32 text-5xl ring-4 ring-white dark:ring-white/10" />
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                aria-label="Edit profile"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-success bg-background text-dark transition hover:brightness-95"
              >
                <IconPencilSquare className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-2.5 text-lg font-medium text-primary transition hover:opacity-80 dark:text-secondary"
            >
              <IconPencilSquare className="h-6 w-6" />
              Change Profile Information
            </button>
          )}
        </div>

        <div className="flex max-w-md flex-col gap-7">
          <Field label="Name">
            {editing ? (
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            ) : (
              <div className={fieldBoxClass}>{customer.name}</div>
            )}
          </Field>

          <Field label="Phone Number">
            {editing ? (
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            ) : (
              <div className={fieldBoxClass}>
                <FlagBD className="h-7 w-12 shrink-0" />
                {customer.phone}
              </div>
            )}
          </Field>

          <Field label="Email">
            {editing ? (
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            ) : (
              <div className={fieldBoxClass}>{customer.email || <span className="text-dark/40">Not added</span>}</div>
            )}
          </Field>

          <Field label="Address">
            {editing ? (
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${inputClass} h-auto resize-none py-4`}
              />
            ) : (
              <div className={`${fieldBoxClass} h-auto min-h-14 py-4`}>
                {customer.address || <span className="text-dark/40">Not added</span>}
              </div>
            )}
          </Field>

          <Field label="City">
            {editing ? (
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
            ) : (
              <div className={fieldBoxClass}>{customer.city || <span className="text-dark/40">Not added</span>}</div>
            )}
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}
          {success && <p className="text-sm text-success">{success}</p>}

          {editing && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-sm border border-black/10 px-7 py-3.5 text-sm font-semibold text-dark transition hover:bg-background disabled:opacity-50 dark:border-white/10"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
