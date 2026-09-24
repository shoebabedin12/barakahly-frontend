import type { ComponentType } from "react";

type IconComponent = ComponentType<{ className?: string }>;

const baseLabelClass =
  "pointer-events-none absolute top-1/2 origin-left -translate-y-1/2 text-sm text-dark/50 transition-all duration-150 " +
  "peer-focus:top-0 peer-focus:left-2.5 peer-focus:scale-90 peer-focus:bg-background peer-focus:px-1 peer-focus:text-primary " +
  "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-dark/60";

export function FloatingInput({
  label,
  type = "text",
  required,
  disabled,
  autoFocus,
  value,
  onChange,
  icon: Icon,
  className = "",
  max,
}: {
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: IconComponent;
  className?: string;
  max?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-dark/40" />
      )}
      <input
        type={type}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        max={max}
        placeholder=" "
        className={`peer w-full rounded-lg border border-black/10 p-3 text-sm text-dark focus:border-primary focus:outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5 ${
          Icon ? "pl-10" : ""
        }`}
      />
      <label className={`${baseLabelClass} ${Icon ? "left-10" : "left-3"}`}>{label}</label>
    </div>
  );
}

export function FloatingTextarea({
  label,
  required,
  rows,
  value,
  onChange,
  className = "",
}: {
  label: string;
  required?: boolean;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full rounded-lg border border-black/10 p-3 text-sm text-dark focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
      />
      <label className={`${baseLabelClass} left-3 peer-placeholder-shown:top-3.5 peer-placeholder-shown:translate-y-0`}>
        {label}
      </label>
    </div>
  );
}
