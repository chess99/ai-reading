import { getAllBooks, getAllCategories } from '@/lib/books';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';

export default function HomePage() {
  const allBooks = getAllBooks();
  const categories = getAllCategories();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8 md:mb-12">
          <SearchBar books={allBooks} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
          <div
            className="p-4 md:p-6 rounded-xl"
            style={{ background: 'linear-gradient(to bottom right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }}
          >
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#667eea' }}>
              {allBooks.length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">本书籍</div>
          </div>
          <div
            className="p-4 md:p-6 rounded-xl"
            style={{ background: 'linear-gradient(to bottom right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }}
          >
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#667eea' }}>
              {categories.length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">个分类</div>
          </div>
          <div
            className="p-4 md:p-6 rounded-xl"
            style={{ background: 'linear-gradient(to bottom right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }}
          >
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#667eea' }}>
              {new Set(allBooks.map(b => b.author)).size}
            </div>
            <div className="text-xs md:text-sm text-gray-600">位作者</div>
          </div>
          <div
            className="p-4 md:p-6 rounded-xl"
            style={{ background: 'linear-gradient(to bottom right, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' }}
          >
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#667eea' }}>AI</div>
            <div className="text-xs md:text-sm text-gray-600">驱动解读</div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">浏览分类</h2>
          <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => {
              const categoryBooks = allBooks.filter(
                book => book.category === category
              );
              return (
                <CategoryCard
                  key={category}
                  category={category}
                  books={categoryBooks}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
