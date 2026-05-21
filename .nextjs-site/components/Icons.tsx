interface IconProps {
  className?: string;
}

export function HomeIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 10.7 12 4l8 6.7V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.3Z" />
    </svg>
  );
}

export function LibraryIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5.5c2.7-.8 5-.4 7 1.1 2-1.5 4.3-1.9 7-1.1v13.1c-2.7-.8-5-.4-7 1.1-2-1.5-4.3-1.9-7-1.1V5.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.6v13.1" />
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="m20 20-4.6-4.6m2.1-5.2a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0Z" />
    </svg>
  );
}

export function SettingsIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.1 13.4a7.7 7.7 0 0 0 0-2.8l2-1.5-1.9-3.2-2.4 1a7.6 7.6 0 0 0-2.4-1.4L14 3h-4l-.4 2.5a7.6 7.6 0 0 0-2.4 1.4l-2.4-1-1.9 3.2 2 1.5a7.7 7.7 0 0 0 0 2.8l-2 1.5 1.9 3.2 2.4-1a7.6 7.6 0 0 0 2.4 1.4L10 21h4l.4-2.5a7.6 7.6 0 0 0 2.4-1.4l2.4 1 1.9-3.2-2-1.5Z" />
    </svg>
  );
}

export function BookIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 4h10a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 4v18M10.5 8H16" />
    </svg>
  );
}

export function ChevronRightIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ShuffleIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h2.4c2 0 3.2 1 4.2 2.9l2.8 5.2c1 1.9 2.2 2.9 4.2 2.9H20" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m17 15 3 3-3 3M4 18h2.4c1.6 0 2.7-.7 3.6-2M14 8c.9-1.3 2-2 3.6-2H20m-3-3 3 3-3 3" />
    </svg>
  );
}

export function MenuIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
