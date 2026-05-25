'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { getStoredPreviousPath } from '@/lib/navigation-history';
import { HomeIcon, LibraryIcon, MenuIcon, SearchIcon, SettingsIcon } from '@/components/Icons';

interface HeaderProps {
  mode?: 'home' | 'book';
  bookTitle?: string;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Header({ mode = 'home', bookTitle, onMenuClick, onSettingsClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const desktopNav = [
    { href: '/', label: '首页', icon: HomeIcon },
    { href: '/library', label: '书库', icon: LibraryIcon },
    { href: '/search', label: '搜索', icon: SearchIcon },
  ] as const;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && getStoredPreviousPath(window.sessionStorage)) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return;
    try {
      await navigator.share({ title: bookTitle, url: window.location.href });
      trackEvent('分享', '分享书籍', bookTitle);
    } catch {
      // user cancelled
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-[#fffdf8]/90 backdrop-blur-xl border-b border-stone-200/80 shadow-[0_1px_0_rgba(79,58,35,0.08)] ${mode === 'home' ? 'hidden md:block' : 'block'}`}>
      <div className="mx-auto w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* ── Left slot ──────────────────────────────────── */}

          {/* Desktop: hamburger always (for sidebar) */}
          <div className="hidden md:flex items-center gap-3 min-w-0">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-700 active:scale-95"
              aria-label="切换侧边栏"
              title="切换侧边栏"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <Link href="/" className="text-xl md:text-2xl font-black hover:opacity-80 transition-opacity heading-gradient">
              AI 阅读
            </Link>
          </div>

          {/* Mobile home mode: no left element (logo is centered) */}

          {/* Mobile book mode: ← 返回 */}
          {mode === 'book' && (
            <button
              onClick={handleBack}
              className="md:hidden flex items-center gap-1 text-stone-800 font-semibold text-sm -ml-1 p-1 min-w-[56px] active:scale-95"
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
              <Link href="/" className="md:hidden text-xl md:text-2xl font-black hover:opacity-80 transition-opacity heading-gradient">
                AI 阅读
              </Link>
            )}

            <nav className="hidden md:flex items-center gap-1 rounded-lg border border-stone-200/80 bg-[#fffdf8]/70 p-1">
              {desktopNav.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors ${
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

            {/* Share: mobile book mode only */}
            {mode === 'book' && (
              <button
                onClick={handleShare}
                className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors group active:scale-95"
                aria-label="分享"
              >
                <svg className="w-5 h-5 text-stone-700 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}

            {/* Settings: desktop always + mobile home mode */}
            <button
              onClick={onSettingsClick}
              className={`${mode === 'book' ? 'hidden md:block' : ''} p-2 hover:bg-stone-100 rounded-lg transition-colors group active:scale-95`}
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
