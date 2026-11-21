'use client';

import Link from 'next/link';
import { navigationCurrent } from '@/lib/navigation-section';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredPreviousPath } from '@/lib/navigation-history';
import { HomeIcon, LibraryIcon, MenuIcon, SearchIcon, SettingsIcon, TopicIcon } from '@/components/Icons';
import ShareButton, { ShareConfig } from '@/components/ShareButton';
import { BRAND_NAME } from '@/lib/brand';

interface HeaderProps {
  mode?: 'home' | 'book';
  bookTitle?: string;
  shareConfig?: ShareConfig;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  sidebarExpanded?: boolean;
  sidebarControls?: string;
}

export default function Header({ mode = 'home', bookTitle, shareConfig, onMenuClick, onSettingsClick, sidebarExpanded, sidebarControls }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const desktopNav = [
    { href: '/', label: '首页', icon: HomeIcon },
    { href: '/topics', label: '主题', icon: TopicIcon },
    { href: '/library', label: '书库', icon: LibraryIcon },
    { href: '/search', label: '搜索', icon: SearchIcon },
  ] as const;

  const handleBack = () => {
    if (typeof window !== 'undefined' && getStoredPreviousPath(window.sessionStorage)) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <header className={`app-header sticky top-0 z-50 bg-(--color-surface) border-b border-stone-200/80 shadow-[0_1px_0_rgba(79,58,35,0.08)] ${mode === 'home' ? 'hidden md:block' : 'block'}`}>
      <div className="mx-auto w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* ── Left slot ──────────────────────────────────── */}

          {/* Desktop: hamburger always (for sidebar) */}
          <div className="hidden md:flex items-center gap-3 min-w-0">
            {mode === 'book' && (
              <button onClick={handleBack} className="touch-icon inline-flex gap-1 text-sm font-semibold text-stone-700 hover:bg-stone-100" aria-label="返回">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                <span>返回</span>
              </button>
            )}
            <button
              onClick={onMenuClick}
              className="touch-icon -ml-2 hover:bg-stone-100 text-stone-700 active:scale-95"
              aria-label={sidebarExpanded ? '收起书库' : '打开书库'}
              aria-expanded={sidebarExpanded}
              aria-controls={sidebarControls}
              title={sidebarExpanded ? '收起书库' : '打开书库'}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <Link href="/" prefetch={false} className="inline-flex min-h-11 items-center whitespace-nowrap text-xl lg:text-2xl font-black hover:opacity-80 transition-opacity heading-gradient">
              {BRAND_NAME}
            </Link>
          </div>

          {/* Mobile home mode: no left element (logo is centered) */}

          {/* Mobile book mode: ← 返回 */}
          {mode === 'book' && (
            <button
              onClick={handleBack}
              className="md:hidden flex min-h-11 items-center gap-1 text-stone-800 font-semibold text-sm -ml-1 px-1 min-w-[56px] active:scale-95"
              aria-label="返回"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>返回</span>
            </button>
          )}

          {/* Mobile home mode: spacer to keep logo centered */}
          {mode === 'home' && (
            <div className="md:hidden w-[56px]" />
          )}

          {/* ── Center: Mobile title / desktop page nav ───── */}
          <div className="flex flex-1 items-center justify-center min-w-0 px-2">
            {mode === 'book' ? (
              <span className="md:hidden flex-1 text-center text-sm font-semibold text-stone-950 truncate px-2">
                {bookTitle}
              </span>
            ) : (
              <Link href="/" prefetch={false} className="md:hidden text-xl md:text-2xl font-black hover:opacity-80 transition-opacity heading-gradient">
                {BRAND_NAME}
              </Link>
            )}

            <nav className="hidden md:flex items-center gap-1 rounded-lg border border-stone-200/80 bg-[#fffdf8]/70 p-1">
              {desktopNav.map(item => {
                const Icon = item.icon;
                const active = navigationCurrent(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    aria-current={active}
                    className={`flex h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors ${
                      active ? 'bg-brand/10 text-brand' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Right slot ─────────────────────────────────── */}
          <div className="flex items-center gap-1 md:gap-3 min-w-[56px] justify-end">

            {/* Share: mobile detail mode only */}
            {mode === 'book' && shareConfig && (
              <ShareButton shareConfig={shareConfig} className="touch-icon md:hidden hover:bg-stone-100 group active:scale-95" />
            )}

            {/* Settings: desktop always + mobile home mode */}
            <button
              onClick={onSettingsClick}
              className={`${mode === 'book' ? 'hidden md:inline-flex' : ''} touch-icon hover:bg-stone-100 group active:scale-95`}
              aria-label="设置"
              title="设置"
            >
              <SettingsIcon className="w-5 h-5 text-stone-700 group-hover:text-brand transition-colors" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
