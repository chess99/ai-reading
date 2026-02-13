import Link from 'next/link';
import { getAllBooks, getAllCategories } from '@/lib/books';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const allBooks = getAllBooks();
  const categories = getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar books={allBooks} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand mb-1">
              {allBooks.length}
            </div>
            <div className="text-sm text-gray-600">本书籍</div>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand mb-1">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">个分类</div>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand mb-1">
              {new Set(allBooks.map(b => b.author)).size}
            </div>
            <div className="text-sm text-gray-600">位作者</div>
          </div>
          <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand mb-1">AI</div>
            <div className="text-sm text-gray-600">驱动解读</div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">浏览分类</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => {
              const categoryBooks = allBooks.filter(
                book => book.category === category
              );
              return (
                <div
                  key={category}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-brand/30 transition-all"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">📚</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{category}</h3>
                      <p className="text-gray-500 text-sm">
                        {categoryBooks.length} 本书籍
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {categoryBooks.slice(0, 3).map(book => (
                      <Link
                        key={book.slug}
                        href={`/books/${book.slug}`}
                        className="block text-sm text-gray-700 hover:text-brand truncate transition-colors"
                      >
                        • {book.title}
                      </Link>
                    ))}
                    {categoryBooks.length > 3 && (
                      <div className="text-sm text-gray-400 pt-1">
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
