import Link from 'next/link';
import type { TopicMeta } from '@/lib/topics';
import { TOPIC_MODE_LABELS } from '@/lib/topic-discovery';
interface TopicCardProps { topic: TopicMeta; compact?: boolean; analyticsPosition?: number; }
export default function TopicCard({ topic, compact = false, analyticsPosition }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}/`} prefetch={false}
      data-home-item-slug={analyticsPosition ? topic.slug : undefined} data-home-position={analyticsPosition}
      className={`group surface-card surface-card-hover block ${compact ? 'p-5 min-w-[280px] md:min-w-[340px]' : 'p-5 md:p-6'}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-brand">{topic.domains.join(' · ')}</span>
        <span className="text-xs text-stone-500">{TOPIC_MODE_LABELS[topic.mode]}</span>
      </div>
      <h3 className="text-lg font-black tracking-tight text-stone-950 group-hover:text-brand md:text-xl">{topic.title}</h3>
      <p className={`mt-3 text-sm leading-6 text-stone-600 ${compact ? 'line-clamp-2' : ''}`}>{topic.description}</p>
      <p className="mt-4 text-xs text-stone-500">书单 {topic.bookCount} 本 · 解读 {topic.availableCount} 本可读</p>
    </Link>
  );
}
