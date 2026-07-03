'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import UpdateNotification from '@/components/UpdateNotification';
import SettingsDialog from '@/components/SettingsDialog';
import { BookTreeNode, BookMeta } from '@/lib/books';
import { TopicMeta } from '@/lib/topics';
import { updateNavigationHistory } from '@/lib/navigation-history';

interface LayoutClientProps {
  bookTree: BookTreeNode[];
  allBooks: BookMeta[];
  allTopics: TopicMeta[];
  children: React.ReactNode;
}

export default function LayoutClient({ bookTree, allBooks, allTopics, children }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isInitialNavigation = useRef(true);
  const mainRef = useRef<HTMLElement | null>(null);
  const scrollPositionsRef = useRef<Record<string, { top: number; left: number }>>({});
  const pathname = usePathname();
  const [isMiniappEmbed, setIsMiniappEmbed] = useState(false);

  // Derive book title for Header when on a book page
  const bookSlug = pathname.startsWith('/books/')
    ? pathname.replace('/books/', '').replace(/\/$/, '')
    : null;
  const currentBook = bookSlug ? (allBooks.find(b => b.slug === bookSlug) ?? null) : null;
  const isBookPage = currentBook !== null;
  const topicSlug = pathname.startsWith('/topics/')
    ? pathname.replace('/topics/', '').replace(/\/$/, '')
    : null;
  const currentTopic = topicSlug ? (allTopics.find(topic => topic.slug === topicSlug) ?? null) : null;
  const isTopicPage = currentTopic !== null;
  const currentDetailTitle = currentBook?.title || currentTopic?.title;
  const shareConfig = currentBook
    ? {
        title: currentBook.title,
        eventAction: 'share_book',
        eventLabel: currentBook.title,
      }
    : currentTopic
      ? {
          title: `${currentTopic.title}：主题阅读路径`,
          text: currentTopic.description,
          eventAction: 'share_topic',
          eventLabel: currentTopic.title,
        }
      : undefined;

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsMiniappEmbed(params.get('miniapp') === '1');
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

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden overscroll-none">
      <div className={isMiniappEmbed ? 'miniapp-embed contents' : 'contents'}>
      {!isMiniappEmbed && <Header
        mode={isBookPage || isTopicPage ? 'book' : 'home'}
        bookTitle={currentDetailTitle}
        shareConfig={shareConfig}
        onMenuClick={() => setSidebarOpen(open => !open)}
        onSettingsClick={() => setSettingsOpen(true)}
      />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: desktop workspace navigation */}
        {!isMiniappEmbed && <div className={`${sidebarOpen ? 'hidden md:block' : 'hidden'}`}>
          <Sidebar
            bookTree={bookTree}
            allBooks={allBooks}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>}

        {/* Main content — pb-16 on mobile to clear fixed BottomNav */}
        <main
          ref={mainRef}
          onScroll={saveCurrentScrollPosition}
          className="flex-1 overflow-auto overflow-x-hidden overscroll-contain pb-16 md:pb-0"
        >
          {children}
        </main>
      </div>

      {!isMiniappEmbed && <BottomNav />}
      {!isMiniappEmbed && <UpdateNotification />}
      {!isMiniappEmbed && <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        allBooks={allBooks}
      />}
      </div>
    </div>
  );
}
