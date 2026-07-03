import { notFound } from 'next/navigation';
import { getAllBookMetas, getBookDetailBySlug } from '@/lib/books';
import 'highlight.js/styles/atom-one-dark.css';
import BookPageClient from './page-client';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME } from '@/lib/brand';
import { getWereadUrlForBook } from '@/lib/external-links';

function injectBookLinks(content: string, currentSlug: string): string {
  const books = getAllBookMetas();
  const titleToSlug = new Map(
    books
      .filter(b => b.slug !== currentSlug)
      .map(b => [b.title, b.slug])
  );

  return content.replace(/《([^》]+)》/g, (match, title) => {
    const slug = titleToSlug.get(title);
    return slug ? `[${match}](/books/${slug})` : match;
  });
}

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all books
export async function generateStaticParams() {
  const books = getAllBookMetas();
  return books.map(book => ({
    slug: book.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookDetailBySlug(slug);

  if (!book) {
    return {
      title: `书籍未找到 - ${BRAND_NAME}`,
    };
  }

  const pageUrl = `${BASE_URL}/books/${slug}/`;
  const description = `《${book.title}》书籍解读：作者 ${book.author}。由 AI 辅助整理并经人工校审，提炼核心观点、关键框架与实践洞见。分类：${book.category}。`;

  return {
    title: `《${book.title}》书籍解读：核心观点与读书笔记 | ${BRAND_NAME}`,
    description,
    keywords: [book.title, book.author, '书籍解读', '读书笔记', '核心观点', book.category, ...book.tags],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${book.title} - ${book.author}`,
      description,
      url: pageUrl,
      type: 'article',
      locale: 'zh_CN',
      siteName: BRAND_NAME,
      images: [
        {
          url: `${BASE_URL}/share-image.png`,
          width: 512,
          height: 512,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${book.title} - ${book.author}`,
      description,
      images: [`${BASE_URL}/share-image.png`],
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookDetailBySlug(slug);

  if (!book) {
    notFound();
  }

  const pageUrl = `${BASE_URL}/books/${slug}/`;
  const wereadUrl = getWereadUrlForBook(book.slug);
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Book',
        name: book.title,
        author: {
          '@type': 'Person',
          name: book.author,
        },
        inLanguage: 'zh-CN',
        genre: book.category,
        keywords: book.tags.join(', '),
      },
      {
        '@type': 'Article',
        headline: `《${book.title}》书籍解读：核心观点与读书笔记`,
        description: `由 AI 辅助整理并经人工校审的《${book.title}》书籍解读，提炼核心观点、关键框架与实践洞见。`,
        url: pageUrl,
        inLanguage: 'zh-CN',
        datePublished: new Date(book.addedAt).toISOString(),
        dateModified: new Date(book.addedAt).toISOString(),
        author: {
          '@type': 'Organization',
          name: BRAND_NAME,
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: BRAND_NAME,
          url: BASE_URL,
        },
        about: {
          '@type': 'Book',
          name: book.title,
          author: {
            '@type': 'Person',
            name: book.author,
          },
        },
        keywords: ['书籍解读', '读书笔记', '核心观点', book.category, ...book.tags].join(', '),
      },
    ],
  };

  return (
    <article className="mx-auto w-full px-4 py-6 md:px-8 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Content with TOC */}
        <BookPageClient
          content={injectBookLinks(book.content, book.slug)}
          bookSlug={book.slug}
          bookTitle={book.title}
          bookAuthor={book.author}
          bookTags={book.tags}
          wereadUrl={wereadUrl}
        />
      </div>
    </article>
  );
}
