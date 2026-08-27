"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/api";
import { updatePassword, updateProfile } from "@/lib/authApi";

export default function AccountProfilePage() {
  const { customer, refreshAuth } = useAuth();

  // AccountLayout only renders this page once `customer` has loaded, so these
  // initial values are always populated on first render.
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [address, setAddress] = useState(customer?.address ?? "");
  const [city, setCity] = useState(customer?.city ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await updateProfile({ name, phone, email: email || undefined, address: address || undefined, city: city || undefined });
      await refreshAuth();
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Could not update your profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
      setPasswordSuccess("Password updated successfully.");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Could not update your password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-black/10 bg-white p-2 text-sm dark:border-white/10 dark:bg-white/5";

  return (
    <>
      <h1 className="text-2xl font-bold text-dark sm:text-3xl">Profile Settings</h1>

      <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-semibold text-dark">Profile Information</h2>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark">Phone</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-dark">City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
          </div>

          {profileError && <p className="text-sm text-danger">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-success">{profileSuccess}</p>}

          <button
            type="submit"
            disabled={profileSaving}
            className="w-fit rounded-lg bg-primary px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {profileSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-semibold text-dark">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark">Current Password</label>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark">New Password</label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark">Confirm Password</label>
              <input
                required
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-danger">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-success">{passwordSuccess}</p>}

          <button
            type="submit"
            disabled={passwordSaving}
            className="w-fit rounded-lg bg-primary px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </>
  );
}
