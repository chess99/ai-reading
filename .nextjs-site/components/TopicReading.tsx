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
          <Link
            href="/topics"
            className="group surface-card surface-card-hover flex min-w-[180px] md:min-w-[220px] flex-col justify-between p-5"
            aria-label="查看全部主题阅读"
          >
            <span className="text-[11px] font-black tracking-[0.16em] text-brand">ALL TOPICS</span>
            <span className="mt-6 text-base font-black tracking-tight text-stone-950 transition-colors group-hover:text-brand">
              查看全部主题
            </span>
            <span className="mt-2 text-sm leading-6 text-stone-500">更多阅读路径</span>
          </Link>
        </div>
        <div className="flex-shrink-0 w-4 md:hidden" />
      </div>
    </section>
  );
}
