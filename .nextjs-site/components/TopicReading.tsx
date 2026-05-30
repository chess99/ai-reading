import Link from 'next/link';
import TopicCard from '@/components/TopicCard';
import { TopicMeta } from '@/lib/topics';

interface TopicReadingProps {
  topics: TopicMeta[];
}

export default function TopicReading({ topics }: TopicReadingProps) {
  if (topics.length === 0) return null;

  return (
    <section className="mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">主题阅读</h2>
        <Link href="/topics" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
          查看全部
        </Link>
      </div>
      <div className="flex overflow-x-auto pb-2 -mx-4 md:mx-0 scrollbar-none">
        <div className="flex-shrink-0 w-4 md:hidden" />
        <div className="flex gap-3">
          {topics.map(topic => (
            <TopicCard key={topic.slug} topic={topic} compact />
          ))}
        </div>
        <div className="flex-shrink-0 w-4 md:hidden" />
      </div>
    </section>
  );
}
