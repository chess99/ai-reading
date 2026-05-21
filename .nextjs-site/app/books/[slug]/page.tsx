import { notFound } from 'next/navigation';
import { getAllBookMetas, getBookDetailBySlug } from '@/lib/books';
import 'highlight.js/styles/atom-one-dark.css';
import BookPageClient from './page-client';
import { BASE_URL } from '@/lib/config';

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
      title: '书籍未找到 - AI 阅读',
    };
  }

  const pageUrl = `${BASE_URL}/books/${slug}/`;
  const description = `《${book.title}》作者 ${book.author}，AI 提炼的核心知识与洞见。分类：${book.category}。`;

  return {
    title: `${book.title} - ${book.author} | AI 阅读`,
    description,
    keywords: [book.title, book.author, book.category, ...book.tags],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${book.title} - ${book.author}`,
      description,
      url: pageUrl,
      type: 'article',
      locale: 'zh_CN',
      siteName: 'AI 阅读',
      images: [
        {
          url: `${BASE_URL}/icon.png`,
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
      images: [`${BASE_URL}/icon.png`],
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
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    url: pageUrl,
    inLanguage: 'zh-CN',
    genre: book.category,
    keywords: book.tags.join(', '),
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
        />
      </div>
    </article>
  );
}
