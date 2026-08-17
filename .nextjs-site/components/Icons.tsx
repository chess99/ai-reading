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

export function TopicIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 6.5h15M6.5 4.5v15M10 9h8M10 13h6M10 17h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 6.5A2 2 0 0 1 6.5 4.5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11Z" />
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

export function MessageIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5.5h14a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2H9l-5 3v-13.2a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 9.5h8M8 13.5h5" />
    </svg>
  );
}

export function ShareIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M8.7 13.3a3 3 0 1 1 0-2.6m0 2.6 6.6 3.3m-6.6-5.9 6.6-3.3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M18 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
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
