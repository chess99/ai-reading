'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { BookTreeNode } from '@/lib/books';

interface LayoutClientProps {
  bookTree: BookTreeNode[];
  children: React.ReactNode;
}

export default function LayoutClient({ bookTree, children }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading';
    const swPath = `${basePath}/sw.js`;
    const scope = `${basePath}/`;
    navigator.serviceWorker.register(swPath, { scope }).catch(() => {
      // keep silent in production, SW is optional enhancement
    });
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        showMenuButton={true}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          bookTree={bookTree}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
