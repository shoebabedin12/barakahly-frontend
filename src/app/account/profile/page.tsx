"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { FloatingInput, FloatingTextarea } from "@/components/FloatingField";
import { PasswordRequirements, passwordMeetsRequirements } from "@/components/PasswordRequirements";
import { IconFingerprint } from "@/components/icons";
import { ApiError } from "@/lib/api";
import { updatePassword, updateProfile } from "@/lib/authApi";
import { deletePasskey, listPasskeys, registerPasskey, type Passkey } from "@/lib/passkeyApi";
import { PasskeyError, isPasskeySupported } from "@/lib/webauthn";

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

  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[] | null>(null);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser feature check on mount, same pattern as AuthProvider's initial auth check
    setPasskeySupported(isPasskeySupported());
    listPasskeys()
      .then(setPasskeys)
      .catch(() => setPasskeys([]));
  }, []);

  async function handleAddPasskey() {
    const name = window.prompt("Name this passkey (e.g. \"My Phone\"):", "My Device");
    if (!name) return;

    setPasskeyBusy(true);
    setPasskeyError(null);
    try {
      const passkey = await registerPasskey(name);
      setPasskeys((prev) => [passkey, ...(prev ?? [])]);
    } catch (err) {
      setPasskeyError(
        err instanceof PasskeyError || err instanceof ApiError
          ? err.message
          : "Could not add this passkey. Please try again."
      );
    } finally {
      setPasskeyBusy(false);
    }
  }

  async function handleRemovePasskey(id: number) {
    setPasskeyBusy(true);
    setPasskeyError(null);
    try {
      await deletePasskey(id);
      setPasskeys((prev) => (prev ?? []).filter((p) => p.id !== id));
    } catch (err) {
      setPasskeyError(err instanceof ApiError ? err.message : "Could not remove this passkey.");
    } finally {
      setPasskeyBusy(false);
    }
  }

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

  return (
    <>
      <h1 className="text-2xl font-bold text-dark sm:text-3xl">Profile Settings</h1>

      <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-semibold text-dark">Profile Information</h2>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <FloatingInput label="Name" required value={name} onChange={(e) => setName(e.target.value)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingInput label="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            <FloatingInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <FloatingTextarea label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <FloatingInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />

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
          <FloatingInput
            label="Current Password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingInput
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FloatingInput
              label="Confirm Password"
              type="password"
              required
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            />
          </div>

          {newPassword.length > 0 && (
            <PasswordRequirements password={newPassword} confirmation={newPasswordConfirmation} />
          )}

          {passwordError && <p className="text-sm text-danger">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-success">{passwordSuccess}</p>}

          <button
            type="submit"
            disabled={passwordSaving || !passwordMeetsRequirements(newPassword, newPasswordConfirmation)}
            className="w-fit rounded-lg bg-primary px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {passkeySupported && (
        <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-dark">Passkeys</h2>
              <p className="mt-1 text-sm text-dark/60">
                Sign in with your fingerprint, face, or device PIN instead of a password.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPasskey}
              disabled={passkeyBusy}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              <IconFingerprint className="h-4 w-4" />
              Add a Passkey
            </button>
          </div>

          {passkeyError && <p className="mb-3 text-sm text-danger">{passkeyError}</p>}

          {passkeys === null ? (
            <p className="text-sm text-dark/50">Loading...</p>
          ) : passkeys.length === 0 ? (
            <p className="text-sm text-dark/50">No passkeys added yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5 dark:divide-white/10">
              {passkeys.map((passkey) => (
                <li key={passkey.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-dark">{passkey.name}</p>
                    <p className="text-xs text-dark/50">
                      {passkey.authenticator ? `${passkey.authenticator} · ` : ""}
                      {passkey.last_used_at
                        ? `Last used ${new Date(passkey.last_used_at).toLocaleDateString()}`
                        : `Added ${passkey.created_at ? new Date(passkey.created_at).toLocaleDateString() : ""}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePasskey(passkey.id)}
                    disabled={passkeyBusy}
                    className="text-sm font-medium text-danger disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
