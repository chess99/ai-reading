import { notFound } from 'next/navigation';
import { getAllBooks, getBookBySlug } from '@/lib/books';
import ReactMarkdown from 'react-markdown';

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
    title: `${book.title} - ${book.author} | AI Reading`,
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
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
            {book.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">作者：</span>
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">分类：</span>
              <span className="px-2 py-1 bg-brand/10 text-brand text-sm rounded">
                {book.category}
              </span>
            </div>
          </div>
          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {book.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
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
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mt-5 mb-2 text-gray-900">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-900">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-brand pl-4 my-4 italic text-gray-600">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="px-1.5 py-0.5 bg-gray-100 text-brand rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {children}
                  </code>
                );
              },
              strong: ({ children }) => (
                <strong className="font-bold text-gray-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-700">{children}</em>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-brand hover:text-brand-dark underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {book.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
