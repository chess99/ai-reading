import Link from 'next/link';
import { getAllBookMetas, getLatestBooks } from '@/lib/books';
import { getLatestTopics } from '@/lib/topics';
import SearchBar from '@/components/SearchBar';
import ContinueReading from '@/components/ContinueReading';
import NewBooks from '@/components/NewBooks';
import TopicReading from '@/components/TopicReading';
import HomeIntro from '@/components/HomeIntro';
import HomeModuleAnalytics from '@/components/HomeModuleAnalytics';
import { ChevronRightIcon, LibraryIcon } from '@/components/Icons';

export default function HomePage() {
  const allBooks = getAllBookMetas();
  const latestBooks = getLatestBooks(8);
  const latestTopics = getLatestTopics(1);

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

        {/* New Books */}
        <HomeModuleAnalytics module="latest">
          <NewBooks books={latestBooks} />
        </HomeModuleAnalytics>

        {/* Featured Topic */}
        <HomeModuleAnalytics module="topics">
          <TopicReading topics={latestTopics} />
        </HomeModuleAnalytics>

        {/* Library entry */}
        <HomeModuleAnalytics module="library">
          <div className="mb-6 md:mb-8">
            <Link
              href="/library"
              prefetch={false}
              data-home-item-slug="library"
              className="surface-card surface-card-hover group flex items-center gap-4 p-5 md:p-6"
            >
              <span className="icon-tile h-11 w-11 flex-shrink-0">
                <LibraryIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-black text-stone-950 transition-colors group-hover:text-brand md:text-lg">
                  按分类浏览全部书籍
                </span>
                <span className="mt-1 block text-sm leading-6 text-stone-600">
                  从 {allBooks.length} 本书中按领域与书架查找。
                </span>
              </span>
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-stone-400 transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          </div>
        </HomeModuleAnalytics>
      </div>
    </div>
  );
}
