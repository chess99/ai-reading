import Link from 'next/link';
import { TopicMeta } from '@/lib/topics';

interface TopicCardProps {
  topic: TopicMeta;
  compact?: boolean;
  analyticsPosition?: number;
  variant?: 'default' | 'specialty';
  parentTitle?: string;
}

export default function TopicCard({
  topic,
  compact = false,
  analyticsPosition,
  variant = 'default',
  parentTitle,
}: TopicCardProps) {
  const isSpecialty = variant === 'specialty' || topic.kind === 'specialty';
  const primaryLabel = isSpecialty ? '专项深读' : topic.domain || 'TOPIC';
  const visibleTags = [topic.group, ...topic.tags].filter((tag): tag is string => Boolean(tag)).slice(0, isSpecialty ? 2 : 3);

  return (
    <Link
      href={`/topics/${topic.slug}`}
      prefetch={false}
      data-home-item-slug={analyticsPosition ? topic.slug : undefined}
      data-home-position={analyticsPosition}
      className={`group surface-card surface-card-hover block ${
        compact ? 'p-5 min-w-[280px] md:min-w-[340px]' : isSpecialty ? 'p-4' : 'p-5 md:p-6'
      }`}
    >
      <div className={`${isSpecialty ? 'mb-3' : 'mb-4'} flex items-center justify-between gap-3`}>
        <span className="text-[11px] font-black tracking-[0.16em] text-brand">{primaryLabel}</span>
        <span className="chip-muted text-[11px] flex-shrink-0">{topic.bookCount} 本书</span>
      </div>
      <h3
        className={`font-black tracking-tight text-stone-950 group-hover:text-brand transition-colors ${
          isSpecialty ? 'text-base md:text-lg' : 'text-lg md:text-xl'
        }`}
      >
        {topic.title}
      </h3>
      {isSpecialty && parentTitle && (
        <p className="mt-2 text-xs font-semibold text-stone-500">主线：{parentTitle}</p>
      )}
      <p className={`mt-3 text-sm leading-6 text-stone-600 ${compact || isSpecialty ? 'line-clamp-2' : ''}`}>
        {topic.description}
      </p>
      {visibleTags.length > 0 && !isSpecialty && (
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
