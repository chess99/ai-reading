import { getAllBookMetas, getLatestBooks } from '@/lib/books';
import SearchBar from '@/components/SearchBar';
import ContinueReading from '@/components/ContinueReading';
import NewBooks from '@/components/NewBooks';
import HomeIntro from '@/components/HomeIntro';
import HomeModuleAnalytics from '@/components/HomeModuleAnalytics';

export default function HomePage() {
  const allBooks = getAllBookMetas();
  const latestBooks = getLatestBooks(8);

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        {/* Continue Reading */}
        <HomeModuleAnalytics module="continue">
          <ContinueReading />
        </HomeModuleAnalytics>

        {/* What this library helps readers do */}
        <HomeModuleAnalytics module="intro">
          <HomeIntro />
        </HomeModuleAnalytics>

        {/* Search Bar */}
        <HomeModuleAnalytics module="search">
          <div className="mb-8 md:mb-10">
            <SearchBar books={allBooks} />
          </div>
        </HomeModuleAnalytics>

        {/* New Books */}
        <HomeModuleAnalytics module="latest">
          <NewBooks books={latestBooks} />
        </HomeModuleAnalytics>
      </div>
    </div>
  );
}
