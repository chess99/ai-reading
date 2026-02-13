import Link from 'next/link';
import { getAllBooks, getAllCategories } from '@/lib/books';

export default function HomePage() {
  const allBooks = getAllBooks();
  const categories = getAllCategories();

  // Get a random book for the featured section
  const randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
          欢迎来到 AI Reading
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          通过 AI 技术解读经典书籍，提供深度总结和知识分享
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-lg">
            <div className="text-3xl font-bold text-brand mb-1">
              {allBooks.length}
            </div>
            <div className="text-sm text-gray-600">本书籍</div>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-lg">
            <div className="text-3xl font-bold text-brand mb-1">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">个分类</div>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-lg">
            <div className="text-3xl font-bold text-brand mb-1">
              {new Set(allBooks.map(b => b.author)).size}
            </div>
            <div className="text-sm text-gray-600">位作者</div>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-lg">
            <div className="text-3xl font-bold text-brand mb-1">AI</div>
            <div className="text-sm text-gray-600">驱动解读</div>
          </div>
        </div>

        {/* Featured Book */}
        {randomBook && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">随机推荐</h2>
            <Link
              href={`/books/${randomBook.slug}`}
              className="block p-6 border-2 border-brand/20 rounded-lg hover:border-brand hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">📖</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-brand">
                    {randomBook.title}
                  </h3>
                  <p className="text-gray-600 mb-2">作者：{randomBook.author}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-brand/10 text-brand text-xs rounded">
                      {randomBook.category}
                    </span>
                    {randomBook.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-4">浏览分类</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => {
              const categoryBooks = allBooks.filter(
                book => book.category === category
              );
              return (
                <div
                  key={category}
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{category}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {categoryBooks.length} 本书籍
                  </p>
                  <div className="space-y-1">
                    {categoryBooks.slice(0, 3).map(book => (
                      <Link
                        key={book.slug}
                        href={`/books/${book.slug}`}
                        className="block text-sm text-gray-700 hover:text-brand truncate"
                      >
                        • {book.title}
                      </Link>
                    ))}
                    {categoryBooks.length > 3 && (
                      <div className="text-sm text-gray-400">
                        还有 {categoryBooks.length - 3} 本...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
