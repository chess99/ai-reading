import { getAllBookMetas, getAllCategories, getLatestBooks } from '@/lib/books';
import { getLatestTopics } from '@/lib/topics';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import ContinueReading from '@/components/ContinueReading';
import NewBooks from '@/components/NewBooks';
import TopicReading from '@/components/TopicReading';
import HomeIntro from '@/components/HomeIntro';
import HomeModuleAnalytics from '@/components/HomeModuleAnalytics';

export default function HomePage() {
  const allBooks = getAllBookMetas();
  const categories = getAllCategories();
  const latestBooks = getLatestBooks(10);
  const latestTopics = getLatestTopics(3);

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        {/* Continue Reading */}
        <HomeModuleAnalytics module="continue">
          <ContinueReading />
        </HomeModuleAnalytics>

        {/* What this library helps readers do */}
        <HomeIntro />

        {/* Search Bar */}
        <HomeModuleAnalytics module="search">
          <div className="mb-8 md:mb-10">
            <SearchBar books={allBooks} />
          </div>
        </HomeModuleAnalytics>

        {/* Topic Reading */}
        <HomeModuleAnalytics module="topics">
          <TopicReading topics={latestTopics} />
        </HomeModuleAnalytics>

        {/* New Books */}
        <HomeModuleAnalytics module="latest">
          <NewBooks books={latestBooks} />
        </HomeModuleAnalytics>

        {/* Categories */}
        <HomeModuleAnalytics module="categories">
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
        </HomeModuleAnalytics>
      </div>
    </div>
  );
}
