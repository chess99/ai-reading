'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { BookTreeNode } from '@/lib/books';

interface LayoutClientProps {
  bookTree: BookTreeNode[];
  children: React.ReactNode;
}

export default function LayoutClient({ bookTree, children }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
