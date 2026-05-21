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
        <section className="mb-8 md:mb-12 grid max-w-full gap-5 overflow-hidden md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black tracking-[0.18em] text-brand mb-3">READING DESK</p>
            <h1 className="text-[1.72rem] md:text-5xl font-black tracking-tight leading-tight text-stone-950 text-balance break-words [word-break:break-word]">
              把一整座书库整理成可检索、可继续、可离线的阅读工作台
            </h1>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            <div className="surface-card p-3 md:p-4">
              <p className="text-2xl md:text-3xl font-black text-stone-950 tabular-nums">{allBooks.length}</p>
              <p className="text-xs text-stone-500 mt-1">本书</p>
            </div>
            <div className="surface-card p-3 md:p-4">
              <p className="text-2xl md:text-3xl font-black text-stone-950 tabular-nums">{categories.length}</p>
              <p className="text-xs text-stone-500 mt-1">分类</p>
            </div>
            <div className="surface-card p-3 md:p-4 md:col-auto">
              <p className="text-2xl md:text-3xl font-black text-stone-950 tabular-nums">PWA</p>
              <p className="text-xs text-stone-500 mt-1">离线</p>
            </div>
          </div>
        </section>

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
          <h2 className="section-title mb-6">
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
