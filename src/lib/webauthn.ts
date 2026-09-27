/**
 * Thin wrapper around the browser's native WebAuthn JSON helpers
 * (`PublicKeyCredential.parseCreationOptionsFromJSON` /
 * `.parseRequestOptionsFromJSON`, and `credential.toJSON()`). The backend's
 * options and the credential we send back both use the same standardized
 * JSON shape, so no manual base64url encoding/decoding is needed.
 */

export function isPasskeySupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential !== "undefined" &&
    typeof window.PublicKeyCredential.parseCreationOptionsFromJSON === "function" &&
    typeof window.PublicKeyCredential.parseRequestOptionsFromJSON === "function"
  );
}

export class PasskeyError extends Error {}

/** Runs the "create a new passkey" ceremony and returns the JSON to send back to the server. */
export async function createPasskeyCredential(optionsJSON: object) {
  if (!isPasskeySupported()) {
    throw new PasskeyError("This browser doesn't support passkeys.");
  }

  const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(
    optionsJSON as PublicKeyCredentialCreationOptionsJSON
  );

  let credential: Credential | null;
  try {
    credential = await navigator.credentials.create({ publicKey });
  } catch {
    throw new PasskeyError("Passkey setup was cancelled or not completed.");
  }

  if (!credential || !("toJSON" in credential) || typeof credential.toJSON !== "function") {
    throw new PasskeyError("Could not create a passkey on this device.");
  }

  return credential.toJSON() as unknown as Record<string, unknown>;
}

/** Runs the "use a passkey to sign in" ceremony and returns the JSON to send back to the server. */
export async function getPasskeyCredential(optionsJSON: object) {
  if (!isPasskeySupported()) {
    throw new PasskeyError("This browser doesn't support passkeys.");
  }

  const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(
    optionsJSON as PublicKeyCredentialRequestOptionsJSON
  );

  let credential: Credential | null;
  try {
    credential = await navigator.credentials.get({ publicKey });
  } catch {
    throw new PasskeyError("Passkey sign-in was cancelled or not completed.");
  }

  if (!credential || !("toJSON" in credential) || typeof credential.toJSON !== "function") {
    throw new PasskeyError("Could not use a passkey on this device.");
  }

  return credential.toJSON() as unknown as Record<string, unknown>;
}
