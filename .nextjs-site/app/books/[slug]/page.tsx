import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { getAllBookMetas, getBookDetailBySlug, type BookDetail } from '@/lib/books';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';
import BookPageClient from './page-client';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME } from '@/lib/brand';
import { getWereadUrlForBook } from '@/lib/external-links';
import { getTopicsForBook } from '@/lib/topics';
import BookRelatedTopics from '@/components/BookRelatedTopics';
import { rehypeSearchAnchors } from '@/lib/search-anchors.mjs';
import { getContentVersion } from '@/lib/build-info';

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

function getBookShareDescription(book: BookDetail): string {
  if (book.shareDescription) return book.shareDescription;

  const category = book.categoryPath[book.categoryPath.length - 1];
  const tags = [...new Set(book.tags.map(tag => tag.trim()))]
    .filter(tag => tag && tag !== '书籍解读' && !book.categoryPath.includes(tag))
    .slice(0, 2);
  return ['书籍解读', category, ...tags].filter(Boolean).join(' · ');
}

// Generate metadata for SEO and sharing
export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookDetailBySlug(slug);

  if (!book) {
    return {
      title: `书籍未找到 - ${BRAND_NAME}`,
    };
  }

  const pageUrl = `${BASE_URL}/books/${slug}/`;
  const description = getBookShareDescription(book);
  const shareTitle = book.author ? `${book.title} · ${book.author}` : book.title;

  return {
    title: `《${book.title}》书籍解读：核心观点与读书笔记 | ${BRAND_NAME}`,
    description,
    other: { 'ai-reading-content': getContentVersion(`/books/${slug}/`) },
    keywords: [book.title, book.author, '书籍解读', '读书笔记', '核心观点', book.category, ...book.tags],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: shareTitle,
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
      title: shareTitle,
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
  const relatedTopics = getTopicsForBook(book.slug);
  const displayContent = injectBookLinks(book.content, book.slug).replace(/^\s*#\s+[^\n\r]+(?:\r?\n)+/, '');
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
        description: getBookShareDescription(book),
        url: pageUrl,
        inLanguage: 'zh-CN',
        datePublished: new Date(book.addedAt).toISOString(),
        dateModified: new Date(book.addedAt).toISOString(),
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
          '@type': 'WebSite',
          name: BRAND_NAME,
          url: `${BASE_URL}/`,
        },
        author: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: BRAND_NAME,
          url: `${BASE_URL}/`,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: BRAND_NAME,
          url: `${BASE_URL}/`,
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
    <article className="reading-page mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Content with TOC */}
        <BookPageClient
          bookSlug={book.slug}
          bookTitle={book.title}
          bookAuthor={book.author}
          bookTags={book.tags}
          wereadUrl={wereadUrl}
          relatedTopicCount={relatedTopics.length}
          relatedTopics={<BookRelatedTopics topics={relatedTopics} />}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSearchAnchors, rehypeKatex, rehypeHighlight]}
            components={{
              table: ({ children, ...props }) => (
                <div className="markdown-table-wrapper">
                  <table {...props}>{children}</table>
                </div>
              ),
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </BookPageClient>
      </div>
    </article>
  );
}
