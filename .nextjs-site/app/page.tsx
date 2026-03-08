import { getAllBookMetas, getAllCategories, getLatestBooks } from '@/lib/books';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ContinueReading from '@/components/ContinueReading';
import NewBooks from '@/components/NewBooks';

export default function HomePage() {
  const allBooks = getAllBookMetas();
  const categories = getAllCategories();
  const latestBooks = getLatestBooks(10);

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        {/* Continue Reading */}
        <ContinueReading />

        {/* Search Bar */}
        <div className="mb-10 md:mb-14">
          <SearchBar books={allBooks} />
        </div>

        {/* New Books */}
        <NewBooks books={latestBooks} />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10 md:mb-14">
          <div className="stat-card stat-indigo p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 stat-value-indigo">
              {allBooks.length}
            </div>
            <div className="text-xs md:text-sm text-slate-600">本书籍</div>
          </div>
          <div className="stat-card stat-violet p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 stat-value-violet">
              {categories.length}
            </div>
            <div className="text-xs md:text-sm text-slate-600">个分类</div>
          </div>
          <div className="stat-card stat-cyan p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 stat-value-cyan">
              {new Set(allBooks.map(b => b.author)).size}
            </div>
            <div className="text-xs md:text-sm text-slate-600">位作者</div>
          </div>
          <div className="stat-card stat-rose p-4 md:p-5">
            <div className="text-2xl md:text-3xl font-bold mb-1 stat-value-rose">AI</div>
            <div className="text-xs md:text-sm text-slate-600">驱动解读</div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-brand to-brand-dark inline-block" />
            浏览分类
          </h2>
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
  );
}
