'use client';

import { useMemo, useState } from 'react';
import TopicCard from '@/components/TopicCard';
import { SearchIcon } from '@/components/Icons';
import type { TopicMeta } from '@/lib/topics';

interface TopicsDiscoveryProps {
  topics: TopicMeta[];
}

const ALL_DOMAINS_LABEL = '全部';

function getTopicDomain(topic: TopicMeta): string {
  return topic.domain || topic.tags[0] || '未分类';
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

export default function TopicsDiscovery({ topics }: TopicsDiscoveryProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(ALL_DOMAINS_LABEL);

  const domains = useMemo(() => {
    const domainSet = new Set<string>();
    for (const topic of topics) {
      domainSet.add(getTopicDomain(topic));
    }
    return [ALL_DOMAINS_LABEL, ...Array.from(domainSet)];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    const normalizedKeyword = normalizeSearchValue(keyword);

    return topics.filter(topic => {
      const domain = getTopicDomain(topic);
      const matchesDomain = selectedDomain === ALL_DOMAINS_LABEL || domain === selectedDomain;
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        topic.searchText.includes(normalizedKeyword) ||
        topic.title.toLowerCase().includes(normalizedKeyword) ||
        topic.description.toLowerCase().includes(normalizedKeyword);

      return matchesDomain && matchesKeyword;
    });
  }, [keyword, selectedDomain, topics]);

  return (
    <section aria-label="主题筛选" className="space-y-6">
      <div className="surface-card p-4 md:p-5">
        <label htmlFor="topic-search" className="sr-only">
          搜索主题
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
          <input
            id="topic-search"
            type="search"
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder="搜索主题、标签、领域、书名，例如：决策、亲密关系、产品"
            className="input-brand"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3">
          <span className="mr-1 text-sm font-black text-stone-700">领域</span>
          {domains.map(domain => (
            <button
              key={domain}
              type="button"
              aria-pressed={selectedDomain === domain}
              onClick={() => setSelectedDomain(domain)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${
                selectedDomain === domain
                  ? 'border-brand/40 bg-brand/15 text-brand'
                  : 'border-stone-300/80 bg-[#fffdf8] text-stone-700 hover:border-brand/30 hover:text-brand'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {filteredTopics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTopics.map(topic => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="surface-card p-8 text-center">
          <h2 className="text-lg font-black text-stone-950">没有找到匹配的主题</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">试试换一个关键词，或切回全部领域。</p>
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setSelectedDomain(ALL_DOMAINS_LABEL);
            }}
            className="btn-outline-brand mt-5"
          >
            清空筛选
          </button>
        </div>
      )}
    </section>
  );
}
