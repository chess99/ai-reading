'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

interface HeaderProps {
  mode?: 'home' | 'book';
  bookTitle?: string;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Header({ mode = 'home', bookTitle, onMenuClick, onSettingsClick }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_0_rgba(148,163,184,0.14)]">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* ── Left slot ──────────────────────────────────── */}

          {/* Desktop: hamburger always (for sidebar) */}
          <button
            onClick={onMenuClick}
            className="hidden md:block p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile home mode: no left element (logo is centered) */}

          {/* Mobile book mode: ← 返回 */}
          {mode === 'book' && (
            <button
              onClick={handleBack}
              className="md:hidden flex items-center gap-1 text-brand font-medium text-sm -ml-1 p-1 min-w-[56px]"
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

          {/* ── Center: Logo / Book title ────────────────── */}
          {mode === 'book' ? (
            <>
              {/* Mobile: book title */}
              <span className="md:hidden flex-1 text-center text-sm font-semibold text-slate-900 truncate px-2">
                {bookTitle}
              </span>
              {/* Desktop: logo */}
              <Link href="/" className="hidden md:block text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity heading-gradient">
                AI 阅读
              </Link>
            </>
          ) : (
            <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity heading-gradient">
              AI 阅读
            </Link>
          )}

          {/* ── Right slot ─────────────────────────────────── */}
          <div className="flex items-center gap-1 md:gap-3 min-w-[56px] justify-end">

            {/* Share: mobile book mode only */}
            {mode === 'book' && (
              <button
                onClick={handleShare}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                aria-label="分享"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}

            {/* Settings: desktop always + mobile home mode */}
            <button
              onClick={onSettingsClick}
              className={`p-2 hover:bg-slate-100 rounded-lg transition-colors group ${mode === 'book' ? 'hidden md:block' : ''}`}
              aria-label="设置"
              title="设置"
            >
              <svg className="w-5 h-5 text-slate-600 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
