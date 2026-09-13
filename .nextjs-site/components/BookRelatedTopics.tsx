import Link from 'next/link';
import { ChevronRightIcon } from '@/components/Icons';
import type { BookTopicLink } from '@/lib/book-topic-index.mjs';

export default function BookRelatedTopics({ topics }: { topics: readonly BookTopicLink[] }) {
  if (topics.length === 0) return null;

  return (
    <section id="book-related-topics" aria-labelledby="book-related-topics-title"
      className="mt-10 scroll-mt-24 border-t border-stone-200 pt-7">
      <h2 id="book-related-topics-title" className="mb-3 text-lg font-black text-stone-950">相关主题</h2>
      <ul className="divide-y divide-stone-200/70">
        {topics.map(topic => (
          <li key={topic.slug}>
            <Link href={`/topics/${topic.slug}/`} prefetch={false}
              className="group -mx-2 flex min-h-11 items-start gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-stone-900 group-hover:text-brand">{topic.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{topic.reason}</p>
              </div>
              <ChevronRightIcon className="mt-1 h-4 w-4 flex-shrink-0 text-brand" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
