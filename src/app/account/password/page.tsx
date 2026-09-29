"use client";

import { useEffect, useState } from "react";
import { PasswordRequirements, passwordMeetsRequirements } from "@/components/PasswordRequirements";
import { IconFingerprint } from "@/components/icons";
import { ApiError } from "@/lib/api";
import { updatePassword } from "@/lib/authApi";
import { deletePasskey, listPasskeys, registerPasskey, type Passkey } from "@/lib/passkeyApi";
import { PasskeyError, isPasskeySupported } from "@/lib/webauthn";

const inputClass =
  "h-14 w-full rounded-sm border border-black/5 bg-white px-5 text-[15px] text-dark outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-sm bg-black/2 dark:bg-white/5">
      <h2 className="border-b border-black/10 bg-black/2 px-6 py-7 text-2xl font-medium text-dark sm:px-10 dark:border-white/10">
        {title}
      </h2>
      <div className="px-6 py-7 sm:px-10">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-3">
      <span className="text-base font-medium text-dark">{label}</span>
      {children}
    </label>
  );
}

export default function AccountPasswordPage() {
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
      <Card title="Change Password">
        <form onSubmit={handlePasswordSubmit} className="flex max-w-md flex-col gap-7">
          <Field label="Current Password">
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="New Password">
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Confirm Password">
            <input
              type="password"
              required
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              className={inputClass}
            />
          </Field>

          {newPassword.length > 0 && (
            <PasswordRequirements password={newPassword} confirmation={newPasswordConfirmation} />
          )}

          {passwordError && <p className="text-sm text-danger">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-success">{passwordSuccess}</p>}

          <button
            type="submit"
            disabled={passwordSaving || !passwordMeetsRequirements(newPassword, newPasswordConfirmation)}
            className="w-fit rounded-sm bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </Card>

      {passkeySupported && (
        <Card title="Fingerprint & Passkeys">
          <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-dark/60">
              Sign in with your fingerprint, face, or device PIN instead of a password.
            </p>
            <button
              type="button"
              onClick={handleAddPasskey}
              disabled={passkeyBusy}
              className="flex shrink-0 items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <IconFingerprint className="h-5 w-5" />
              Add a Passkey
            </button>
          </div>

          {passkeyError && <p className="mb-3 text-sm text-danger">{passkeyError}</p>}

          {passkeys === null ? (
            <p className="text-sm text-dark/50">Loading...</p>
          ) : passkeys.length === 0 ? (
            <p className="text-sm text-dark/50">No passkeys added yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5 rounded-sm bg-white px-5 dark:divide-white/10 dark:bg-white/5">
              {passkeys.map((passkey) => (
                <li key={passkey.id} className="flex items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-3">
                    <IconFingerprint className="h-6 w-6 shrink-0 text-primary dark:text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-dark">{passkey.name}</p>
                      <p className="text-xs text-dark/50">
                        {passkey.authenticator ? `${passkey.authenticator} · ` : ""}
                        {passkey.last_used_at
                          ? `Last used ${new Date(passkey.last_used_at).toLocaleDateString()}`
                          : `Added ${passkey.created_at ? new Date(passkey.created_at).toLocaleDateString() : ""}`}
                      </p>
                    </div>
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
        </Card>
      )}
    </>
  );
}
