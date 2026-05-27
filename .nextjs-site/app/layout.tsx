import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutClient from './layout-client';
import BaiduAnalytics from '@/components/BaiduAnalytics';
import { buildBookTree, getAllBookMetas } from '@/lib/books';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/brand';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ['晨笙阅读', '书籍解读', '读书笔记', 'AI 辅助阅读', '好书精读', '投资', '心理学', '个人成长', '商业管理'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.png',
  },
  appleWebApp: {
    capable: true,
    title: BRAND_NAME,
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: BASE_URL + '/',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: BASE_URL + '/',
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: BASE_URL + '/icon.png',
        width: 512,
        height: 512,
        alt: BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      name: BRAND_NAME,
      url: BASE_URL,
      description: SITE_DESCRIPTION,
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
      name: BRAND_NAME,
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
