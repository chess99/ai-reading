import { notFound } from 'next/navigation';
import { getAllBooks, getBookBySlug } from '@/lib/books';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all books
export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map(book => ({
    slug: book.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

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
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8 pb-6 border-b border-gray-200">
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {book.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">作者：</span>
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">分类：</span>
              <span
                className="px-2 py-1 text-sm rounded"
                style={{
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                }}
              >
                {book.category}
              </span>
            </div>
          </div>
          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
              {book.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs md:text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
          >
            {book.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
