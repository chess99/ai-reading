'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import UpdateNotification from '@/components/UpdateNotification';
import SettingsDialog from '@/components/SettingsDialog';
import FeedbackDialog from '@/components/FeedbackDialog';
import { updateNavigationHistory } from '@/lib/navigation-history';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailDescription, setDetailDescription] = useState('');
  const isInitialNavigation = useRef(true);
  const mainRef = useRef<HTMLElement | null>(null);
  const scrollPositionsRef = useRef<Record<string, { top: number; left: number }>>({});
  const pathname = usePathname();
  const isBookPage = pathname.startsWith('/books/');
  const isTopicPage = pathname.startsWith('/topics/') && pathname !== '/topics';
  const isDetailPage = isBookPage || isTopicPage;
  const shareConfig = isBookPage
    ? {
        title: detailTitle,
        eventAction: 'share_book',
        eventLabel: detailTitle,
      }
    : isTopicPage
      ? {
          title: detailTitle ? `${detailTitle}：主题阅读路径` : undefined,
          text: detailDescription,
          eventAction: 'share_topic',
          eventLabel: detailTitle,
        }
      : undefined;

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }, []);

  const saveCurrentScrollPosition = () => {
    const main = mainRef.current;
    if (!main) return;
    scrollPositionsRef.current[pathname] = { top: main.scrollTop, left: main.scrollLeft };
  };

  useLayoutEffect(() => {
    if (isInitialNavigation.current) return;
    const savedPosition = scrollPositionsRef.current[pathname] ?? { top: 0, left: 0 };
    mainRef.current?.scrollTo({ top: savedPosition.top, left: savedPosition.left });
  }, [pathname]);

  useEffect(() => {
    updateNavigationHistory(window.sessionStorage, pathname, {
      isInitialLoad: isInitialNavigation.current,
      referrer: document.referrer,
      origin: window.location.origin,
    });
    isInitialNavigation.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!isDetailPage) {
      setDetailTitle('');
      setDetailDescription('');
      return;
    }

    setDetailTitle(mainRef.current?.querySelector('h1')?.textContent?.trim() ?? '');
    setDetailDescription(document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '');
  }, [isDetailPage, pathname, children]);

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden overscroll-none">
      <Header
        mode={isDetailPage ? 'book' : 'home'}
        bookTitle={detailTitle}
        shareConfig={shareConfig}
        onMenuClick={() => setSidebarOpen(open => !open)}
        onFeedbackClick={() => setFeedbackOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: desktop workspace navigation */}
        <div className={`${sidebarOpen ? 'hidden md:block' : 'hidden'}`}>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content: pb-16 on mobile to clear fixed BottomNav */}
        <main
          ref={mainRef}
          onScroll={saveCurrentScrollPosition}
          className="flex-1 overflow-auto overflow-x-hidden overscroll-contain pb-16 md:pb-0"
        >
          {children}
        </main>
      </div>

      <BottomNav onFeedbackClick={() => setFeedbackOpen(true)} />
      <UpdateNotification />
      <FeedbackDialog isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
