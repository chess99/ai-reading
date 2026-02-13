import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { buildBookTree } from '@/lib/books';

export const metadata: Metadata = {
  title: 'AI Reading - AI 驱动的书籍解读与知识分享平台',
  description: '通过 AI 技术解读经典书籍，提供深度总结和知识分享',
  keywords: ['AI', '读书', '书籍解读', '知识分享'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bookTree = buildBookTree();

  return (
    <html lang="zh-CN">
      <body>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0">
            <Sidebar bookTree={bookTree} />
          </aside>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
