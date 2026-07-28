import { getAllBookMetas, getAllCategories, getLatestBooks } from '@/lib/books';
import { getLatestTopics } from '@/lib/topics';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ContinueReading from '@/components/ContinueReading';
import NewBooks from '@/components/NewBooks';
import TopicReading from '@/components/TopicReading';
import HomeIntro from '@/components/HomeIntro';

export default function HomePage() {
  const allBooks = getAllBookMetas();
  const categories = getAllCategories();
  const latestBooks = getLatestBooks(10);
  const latestTopics = getLatestTopics(3);

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        {/* Continue Reading */}
        <ContinueReading />

        {/* What this library helps readers do */}
        <HomeIntro />

        {/* Search Bar */}
        <div className="mb-8 md:mb-10">
          <SearchBar books={allBooks} />
        </div>

        {/* Topic Reading */}
        <TopicReading topics={latestTopics} />

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
