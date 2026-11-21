import type { Metadata } from 'next';
import { getAllBookMetas } from '@/lib/books';
import SearchBar from '@/components/SearchBar';
import ContinueReading from '@/components/ContinueReading';
import NewBooks from '@/components/NewBooks';
import HomeIntro from '@/components/HomeIntro';
import HomeModuleAnalytics from '@/components/HomeModuleAnalytics';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/brand';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${BASE_URL}/`,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${BASE_URL}/`,
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: `${BASE_URL}/share-image.png`,
        width: 512,
        height: 512,
        alt: BRAND_NAME,
      },
    ],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: BRAND_NAME,
      alternateName: ['ai-reading'],
      url: `${BASE_URL}/`,
      description: SITE_DESCRIPTION,
      inLanguage: 'zh-CN',
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      creator: {
        '@type': 'Person',
        '@id': 'https://cearl.cc/#person',
        name: '晨笙',
        alternateName: 'Cearl',
        url: 'https://cearl.cc/',
      },
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
      '@id': `${BASE_URL}/#organization`,
      name: BRAND_NAME,
      url: `${BASE_URL}/`,
      description: SITE_DESCRIPTION,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      founder: {
        '@type': 'Person',
        '@id': 'https://cearl.cc/#person',
        name: '晨笙',
        alternateName: 'Cearl',
        url: 'https://cearl.cc/',
      },
      sameAs: [
        'https://github.com/chess99/ai-reading',
      ],
    },
  ],
};

export default function HomePage() {
  const allBooks = getAllBookMetas();
  const renderedAt = Date.now();

  return (
    <div className="page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="page-content-6xl">
        <HomeModuleAnalytics module="intro">
          <HomeIntro />
        </HomeModuleAnalytics>

        <HomeModuleAnalytics module="continue">
          <ContinueReading />
        </HomeModuleAnalytics>

        {/* Search Bar */}
        <HomeModuleAnalytics module="search">
          <div className="mb-8 md:mb-10">
            <SearchBar books={allBooks} />
          </div>
        </HomeModuleAnalytics>

        {/* Recent Updates */}
        <HomeModuleAnalytics module="latest">
          <NewBooks books={allBooks} renderedAt={renderedAt} />
        </HomeModuleAnalytics>
      </div>
    </div>
  );
}
