const MIN_LENGTH = 8;

export function passwordMeetsRequirements(password: string, confirmation: string) {
  return (
    password.length >= MIN_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password) &&
    password === confirmation
  );
}

export function PasswordRequirements({ password, confirmation }: { password: string; confirmation: string }) {
  const checks = [
    { label: `At least ${MIN_LENGTH} characters`, met: password.length >= MIN_LENGTH },
    { label: "An uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "A lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "A number (0-9)", met: /[0-9]/.test(password) },
    { label: "A special character (!@#$...)", met: /[^a-zA-Z0-9]/.test(password) },
    { label: "Passwords match", met: password.length > 0 && password === confirmation },
  ];

  return (
    <ul className="-mt-1 grid grid-cols-1 gap-x-3 gap-y-1.5 rounded-xl bg-background p-3 sm:grid-cols-2 dark:bg-white/5">
      {checks.map((check) => (
        <li
          key={check.label}
          className={`flex items-center gap-2 text-xs font-medium transition ${
            check.met ? "text-success" : "text-dark/40"
          }`}
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
              check.met ? "border-success bg-success text-background" : "border-black/20 dark:border-white/20"
            }`}
          >
            {check.met && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-2.5 w-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            )}
          </span>
          {check.label}
        </li>
      ))}
    </ul>
  );
}
