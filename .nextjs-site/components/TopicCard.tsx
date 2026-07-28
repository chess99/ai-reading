import Link from 'next/link';
import { TopicMeta } from '@/lib/topics';

interface TopicCardProps {
  topic: TopicMeta;
  compact?: boolean;
  analyticsPosition?: number;
}

export default function TopicCard({ topic, compact = false, analyticsPosition }: TopicCardProps) {
  const primaryLabel = topic.domain || 'TOPIC';
  const visibleTags = [topic.group, ...topic.tags].filter((tag): tag is string => Boolean(tag)).slice(0, 3);

  return (
    <Link
      href={`/topics/${topic.slug}`}
      prefetch={false}
      data-home-item-slug={analyticsPosition ? topic.slug : undefined}
      data-home-position={analyticsPosition}
      className={`group surface-card surface-card-hover block ${compact ? 'p-5 min-w-[280px] md:min-w-[340px]' : 'p-5 md:p-6'}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[11px] font-black tracking-[0.16em] text-brand">{primaryLabel}</span>
        <span className="chip-muted text-[11px] flex-shrink-0">{topic.bookCount} 本书</span>
      </div>
      <h3 className="text-lg md:text-xl font-black tracking-tight text-stone-950 group-hover:text-brand transition-colors">
        {topic.title}
      </h3>
      <p className={`mt-3 text-sm leading-6 text-stone-600 ${compact ? 'line-clamp-2' : ''}`}>
        {topic.description}
      </p>
      {visibleTags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {visibleTags.map(tag => (
            <span key={tag} className="chip-brand text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
