import { getAllBooks, getAllCategories } from '@/lib/books';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';

export default function HomePage() {
  const allBooks = getAllBooks();
  const categories = getAllCategories();

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        {/* Search Bar */}
        <div className="mb-10 md:mb-14">
          <SearchBar books={allBooks} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10 md:mb-14">
          <div className="stat-card p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-brand">
              {allBooks.length}
            </div>
            <div className="text-xs md:text-sm text-slate-600">本书籍</div>
          </div>
          <div className="stat-card p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-brand">
              {categories.length}
            </div>
            <div className="text-xs md:text-sm text-slate-600">个分类</div>
          </div>
          <div className="stat-card p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-brand">
              {new Set(allBooks.map(b => b.author)).size}
            </div>
            <div className="text-xs md:text-sm text-slate-600">位作者</div>
          </div>
          <div className="stat-card p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-brand">AI</div>
            <div className="text-xs md:text-sm text-slate-600">驱动解读</div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">浏览分类</h2>
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
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
