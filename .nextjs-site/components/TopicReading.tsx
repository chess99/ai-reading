import Link from 'next/link';
import { ChevronRightIcon } from '@/components/Icons';
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
        <Link href="/topics" prefetch={false} className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
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
            prefetch={false}
            className="group flex min-w-[144px] md:min-w-[160px] flex-col justify-center rounded-lg border border-dashed border-brand/30 bg-[#fffdf8]/70 px-4 py-5 transition-all duration-200 hover:border-brand/55 hover:bg-brand/10"
            aria-label="查看全部主题阅读"
          >
            <span className="text-sm font-black tracking-tight text-stone-950 transition-colors group-hover:text-brand">
              全部主题
            </span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand">
              继续浏览
              <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
        <div className="flex-shrink-0 w-4 md:hidden" />
      </div>
    </section>
  );
}
