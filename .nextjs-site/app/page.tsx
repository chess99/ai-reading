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
