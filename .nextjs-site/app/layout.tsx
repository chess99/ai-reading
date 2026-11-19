import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutClient from './layout-client';
import BaiduAnalytics from '@/components/BaiduAnalytics';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/brand';
import { appVersion, buildVersion, libraryVersion } from '@/lib/build-info';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ['晨笙阅读', '书籍解读', '读书笔记', '主题阅读', '好书精读', '投资', '心理学', '个人成长', '商业管理'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: BRAND_NAME,
    statusBarStyle: 'default',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: BASE_URL + '/share-image.png',
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
    images: [BASE_URL + '/share-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#9a6b2f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="ai-reading-build" content={buildVersion} />
        <meta name="ai-reading-app" content={appVersion} />
        <meta name="ai-reading-library" content={libraryVersion} />
        <link rel="alternate" type="application/rss+xml" title={`${BRAND_NAME} 全文 RSS`} href={`${BASE_URL}/feed.xml`} />
      </head>
      <body>
        <BaiduAnalytics />
        <GoogleAnalytics />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
