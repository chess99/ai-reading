import { notFound } from 'next/navigation';
import { getAllBookMetas, getBookDetailBySlug } from '@/lib/books';
import 'highlight.js/styles/atom-one-dark.css';
import BookPageClient from './page-client';

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
      title: '书籍未找到 - AI Reading',
    };
  }

  return {
    title: `${book.title} - ${book.author} | AI 阅读`,
    description: `${book.title} by ${book.author} - AI 驱动的书籍解读`,
    keywords: [book.title, book.author, book.category, ...book.tags],
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookDetailBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-10 pb-6 border-b border-slate-200">
          <h1 className="heading-gradient text-3xl md:text-4xl font-bold mb-5">
            {book.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">作者：</span>
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">分类：</span>
              <span className="chip-brand">
                {book.category}
              </span>
            </div>
          </div>
          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {book.tags.map(tag => (
                <span key={tag} className="chip-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content with TOC */}
        <BookPageClient content={book.content} />
      </div>
    </article>
  );
}
