import type { Metadata } from 'next';
import './globals.css';
import LayoutClient from './layout-client';
import { buildBookTree } from '@/lib/books';

export const metadata: Metadata = {
  title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
  description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
  keywords: ['AI', '读书', '书籍解读', '知识分享', '投资', '心理学', '个人成长', '商业管理'],
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
        <LayoutClient bookTree={bookTree}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
