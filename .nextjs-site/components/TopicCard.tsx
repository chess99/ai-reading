import Link from 'next/link';
import type { TopicMeta } from '@/lib/topics';
import { TOPIC_MODE_LABELS } from '@/lib/topic-discovery';
interface TopicCardProps { topic: TopicMeta; compact?: boolean; variant?: 'row' | 'card'; analyticsPosition?: number; }
export default function TopicCard({ topic, compact = false, variant = 'row', analyticsPosition }: TopicCardProps) {
  const cardClass = compact
    ? 'surface-card surface-card-hover p-5 min-w-[280px] md:min-w-[340px]'
    : variant === 'card'
      ? 'surface-card surface-card-hover h-full p-5'
      : 'border-b border-[#e4dccf] py-5 transition-colors';
  return (
    <Link href={`/topics/${topic.slug}/`} prefetch={false}
      data-home-item-slug={analyticsPosition ? topic.slug : undefined} data-home-position={analyticsPosition}
      className={`group block ${cardClass}`}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-brand">{topic.domains.join(' · ')}</span>
        <span className="text-xs text-stone-500">{TOPIC_MODE_LABELS[topic.mode]}</span>
      </div>
      <h3 className="text-lg font-bold text-stone-950 group-hover:text-brand md:text-xl">{topic.title}</h3>
      <p className={`mt-1.5 text-sm leading-6 text-stone-600 ${compact ? 'line-clamp-2' : ''}`}>{topic.description}</p>
      <p className="mt-2 text-xs text-stone-500">书单 {topic.bookCount} 本 · 解读 {topic.availableCount} 本可读</p>
    </Link>
  );
}
