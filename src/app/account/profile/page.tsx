"use client";

import { useRef, useState } from "react";
import { AccountAvatar } from "@/components/AccountSidebar";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { AVATAR_MAX_BYTES, AVATAR_TYPES, removeAvatar, updateProfile, uploadAvatar } from "@/lib/authApi";

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

function IconCamera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.83 6.18A2.31 2.31 0 0 1 5.2 7.23c-.38.05-.76.11-1.13.17C3 7.58 2.25 8.5 2.25 9.57V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.57c0-1.07-.76-1.99-1.82-2.17a47.9 47.9 0 0 0-1.13-.17 2.31 2.31 0 0 1-1.64-1.05l-.82-1.31a2.19 2.19 0 0 0-1.74-1.04 48.8 48.8 0 0 0-5.2 0 2.19 2.19 0 0 0-1.74 1.04l-.82 1.31Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
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
  const { customer, refreshAuth, setCustomer } = useAuth();
  const photoInput = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError(null);
    if (!AVATAR_TYPES.includes(file.type)) {
      setPhotoError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setPhotoError("The photo must be 2 MB or smaller.");
      return;
    }
    setPhotoBusy(true);
    try {
      setCustomer(await uploadAvatar(file));
    } catch (err) {
      setPhotoError(err instanceof ApiError ? err.message : "Could not upload your photo.");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handlePhotoRemove() {
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      setCustomer(await removeAvatar());
    } catch (err) {
      setPhotoError(err instanceof ApiError ? err.message : "Could not remove your photo.");
    } finally {
      setPhotoBusy(false);
    }
  }

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
          <div className="flex flex-col items-start gap-2">
            <div className="relative">
              <AccountAvatar
                name={customer.name}
                src={customer.avatar}
                className={`h-32 w-32 text-5xl ring-4 ring-white transition dark:ring-white/10 ${photoBusy ? "opacity-50" : ""}`}
              />
              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                disabled={photoBusy}
                aria-label={customer.avatar ? "Change photo" : "Add a photo"}
                title={customer.avatar ? "Change photo" : "Add a photo"}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-success bg-background text-dark shadow-sm transition hover:brightness-95 disabled:opacity-60"
              >
                {photoBusy ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-dark/30 border-t-dark" />
                ) : (
                  <IconCamera className="h-5 w-5" />
                )}
              </button>
              <input
                ref={photoInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            {customer.avatar && !photoBusy && (
              <button type="button" onClick={handlePhotoRemove} className="text-sm text-dark/60 underline-offset-4 hover:text-danger hover:underline">
                Remove photo
              </button>
            )}
            {photoError && <p className="max-w-56 text-sm text-danger">{photoError}</p>}
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
