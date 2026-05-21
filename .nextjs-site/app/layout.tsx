import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutClient from './layout-client';
import BaiduAnalytics from '@/components/BaiduAnalytics';
import { buildBookTree, getAllBookMetas } from '@/lib/books';
import { BASE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
  description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
  keywords: ['AI', '读书', '书籍解读', '知识分享', '投资', '心理学', '个人成长', '商业管理'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'AI 阅读',
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: BASE_URL + '/',
  },
  openGraph: {
    title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
    description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
    url: BASE_URL + '/',
    siteName: 'AI 阅读',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: BASE_URL + '/icon.png',
        width: 512,
        height: 512,
        alt: 'AI 阅读',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'AI 阅读 - AI 驱动的书籍解读与知识分享平台',
    description: '用 AI 精读好书，提炼知识精华。收录了投资、心理学、个人成长、商业管理等领域的优质书籍。',
    images: [BASE_URL + '/icon.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#9a6b2f',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'AI 阅读',
      url: BASE_URL,
      description: '用 AI 精读好书，提炼知识精华。收录投资、心理学、个人成长、商业管理等领域优质书籍。',
      inLanguage: 'zh-CN',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/search/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'AI 阅读',
      url: BASE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bookTree = buildBookTree();
  const allBooks = getAllBookMetas();

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        <BaiduAnalytics />
        <LayoutClient bookTree={bookTree} allBooks={allBooks}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
