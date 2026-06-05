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
            className="group surface-card surface-card-hover flex min-w-[280px] md:min-w-[340px] flex-col p-5"
            aria-label="查看全部主题阅读"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-[11px] font-black tracking-[0.16em] text-brand">TOPIC</span>
              <span className="chip-muted text-[11px] flex-shrink-0">全部</span>
            </div>
            <h3 className="text-lg md:text-xl font-black tracking-tight text-stone-950 transition-colors group-hover:text-brand">
              更多主题阅读
            </h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              按真实问题浏览完整阅读路径，继续找到下一组适合深入的书。
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="chip-brand inline-flex items-center gap-1 text-xs">
                查看全部主题
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </div>
        <div className="flex-shrink-0 w-4 md:hidden" />
      </div>
    </section>
  );
}
