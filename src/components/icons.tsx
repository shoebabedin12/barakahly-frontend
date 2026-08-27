type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      {children}
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0" />
    </Icon>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 10.5h10.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H6.75a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5Z" />
    </Icon>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372a1.5 1.5 0 0 0-1.06-1.436l-3.884-1.11a1.5 1.5 0 0 0-1.514.393l-.822.822a11.25 11.25 0 0 1-6.24-6.24l.822-.822a1.5 1.5 0 0 0 .393-1.514L8.31 3.31A1.5 1.5 0 0 0 6.872 2.25H5.5A2.25 2.25 0 0 0 2.25 4.5v1.5Z" />
    </Icon>
  );
}

export function IconEnvelope({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-.828.672-1.5 1.5-1.5h16.5c.828 0 1.5.672 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V6.75Zm0 0 9.75 6.75 9.75-6.75" />
    </Icon>
  );
}

export function IconShoppingBag({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.75V5.25a3 3 0 1 1 6 0v1.5m-8.25 0h10.5l.75 12.75a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5L3.75 6.75Z" />
    </Icon>
  );
}

export function IconBanknotes({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5v9a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-9Zm0 0V6a1.5 1.5 0 0 1 1.5-1.5h16.5A1.5 1.5 0 0 1 21.75 6v2.25M12 15a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
    </Icon>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c-3-2.1-8.25-5.55-8.25-10.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.25 3.45c0 4.65-5.25 8.1-8.25 10.2Z" />
    </Icon>
  );
}

export function IconCube({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-4.5-9 4.5m18 0-9 4.5m9-4.5v9l-9 4.5M3 7.5l9 4.5M3 7.5v9l9 4.5m0-9v9" />
    </Icon>
  );
}

export function IconUserCircle({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 20.16a7.5 7.5 0 0 0-10.5 0M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Icon>
  );
}

export function IconSquares({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h6v6h-6v-6Zm10.5 0h6v6h-6v-6Zm-10.5 10.5h6v6h-6v-6Zm10.5 0h6v6h-6v-6Z" />
    </Icon>
  );
}

export function IconLogout({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 12H9m9 0-3-3m3 3-3 3" />
    </Icon>
  );
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 2.25 2.25 4.5-4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Icon>
  );
}

export function IconMagnifyingGlass({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M18.75 10.5a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z" />
    </Icon>
  );
}

export function IconXMark({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </Icon>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-3.227-1.591 1.591M5.25 12H3m3.227-4.773L4.636 5.636M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </Icon>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 15.5A9.75 9.75 0 1 1 8.5 2.25a7.5 7.5 0 0 0 13.25 13.25Z" />
    </Icon>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </Icon>
  );
}

export function IconBars3({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
    </Icon>
  );
}

export function IconMapPin({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </Icon>
  );
}

export function IconCreditCard({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 6.75h19.5A1.5 1.5 0 0 1 23.25 8.25v9a1.5 1.5 0 0 1-1.5 1.5H2.25a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5ZM5.25 15h3" />
    </Icon>
  );
}

export function IconTruck({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 0h8.25m0 0a1.5 1.5 0 1 0 3 0m-3 0a1.5 1.5 0 1 1 3 0m0 0H21m-2.25 0V13.5m0 0H15m3.75 0-1.72-3.44a1.5 1.5 0 0 0-1.34-.81H15M15 13.5V6.75A.75.75 0 0 0 14.25 6H3.75A.75.75 0 0 0 3 6.75v10.5a.75.75 0 0 0 .75.75h1.5"
      />
    </Icon>
  );
}

export function IconShieldCheck({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7-7.5 3v6c0 4.5 3.15 8.7 7.5 9.75 4.35-1.05 7.5-5.25 7.5-9.75v-6l-7.5-3Z"
      />
    </Icon>
  );
}

export function IconArrowPath({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 4.5 21 9m0 0-4.5 4.5M21 9H7.5A4.5 4.5 0 0 0 3 13.5V15m4.5 4.5L3 15m0 0 4.5-4.5M3 15h13.5A4.5 4.5 0 0 0 21 10.5V9"
      />
    </Icon>
  );
}

export function IconChatBubble({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm4.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm4.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </Icon>
  );
}

export function IconNewspaper({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h6.75a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18.75v-9A2.25 2.25 0 0 1 5.25 7.5H12Zm0 0V5.25A2.25 2.25 0 0 1 14.25 3h2.25M9 12.75h6M9 16.5h6M9 9h1.5"
      />
    </Icon>
  );
}

export function IconAdjustmentsHorizontal({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M3.75 6H7.5m0 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm-3.75 12h9.75m6-12h3.75M13.5 12h6.75m-16.5 0h.75m0 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Zm12.75 6a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0h3.75m-16.5 0h9.75"
      />
    </Icon>
  );
}

export function IconHome({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12 11.204 3.045a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
      />
    </Icon>
  );
}
