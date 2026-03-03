'use client';

import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuClick, onSettingsClick, showMenuButton = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_0_rgba(148,163,184,0.14)]">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Menu button for mobile */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          )}

          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity heading-gradient"
          >
            AI 阅读
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3 md:gap-6">
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              aria-label="设置"
              title="设置"
            >
              <svg
                className="w-5 h-5 text-slate-600 group-hover:text-brand transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <a
              href="https://cearl.cc/BookDistill/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-sm md:text-base text-slate-700 font-medium tracking-[0.01em] transition-colors hover:text-brand"
            >
              <span>BookDistill</span>
              <svg
                className="w-3 h-3 opacity-60"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 12 12"
                stroke="currentColor"
              >
                <path d="M10.5 1.5L1.5 10.5M10.5 1.5H4.5M10.5 1.5V7.5" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
