'use client';

import { useMemo, useState } from 'react';
import TopicCard from '@/components/TopicCard';
import { SearchIcon } from '@/components/Icons';
import type { TopicMeta } from '@/lib/topics';

interface TopicsDiscoveryProps {
  topics: TopicMeta[];
}

interface TopicGroup {
  topic: TopicMeta;
  specialties: TopicMeta[];
}

const ALL_DOMAINS_LABEL = '全部';

function getTopicDomain(topic: TopicMeta): string {
  return topic.domain || topic.tags[0] || '未分类';
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function topicMatchesKeyword(topic: TopicMeta, keyword: string): boolean {
  if (keyword.length === 0) {
    return true;
  }

  return (
    topic.searchText.includes(keyword) ||
    topic.title.toLowerCase().includes(keyword) ||
    topic.description.toLowerCase().includes(keyword)
  );
}

export default function TopicsDiscovery({ topics }: TopicsDiscoveryProps) {
  const [keyword, setKeyword] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(ALL_DOMAINS_LABEL);

  const topicGroups = useMemo<TopicGroup[]>(() => {
    const specialtiesByParent = new Map<string, TopicMeta[]>();

    for (const topic of topics) {
      if (topic.kind !== 'specialty' || !topic.parentSlug) {
        continue;
      }
      const existing = specialtiesByParent.get(topic.parentSlug) || [];
      existing.push(topic);
      specialtiesByParent.set(topic.parentSlug, existing);
    }

    return topics
      .filter(topic => topic.kind !== 'specialty')
      .map(topic => ({
        topic,
        specialties: specialtiesByParent.get(topic.slug) || [],
      }));
  }, [topics]);

  const domains = useMemo(() => {
    const domainSet = new Set<string>();
    for (const { topic } of topicGroups) {
      domainSet.add(getTopicDomain(topic));
    }
    return [ALL_DOMAINS_LABEL, ...Array.from(domainSet)];
  }, [topicGroups]);

  const filteredGroups = useMemo(() => {
    const normalizedKeyword = normalizeSearchValue(keyword);

    return topicGroups.flatMap(group => {
      const domain = getTopicDomain(group.topic);
      const matchesDomain = selectedDomain === ALL_DOMAINS_LABEL || domain === selectedDomain;
      if (!matchesDomain) {
        return [];
      }

      const parentMatches = topicMatchesKeyword(group.topic, normalizedKeyword);
      const matchingSpecialties = group.specialties.filter(topic => topicMatchesKeyword(topic, normalizedKeyword));

      if (normalizedKeyword.length === 0) {
        return [group];
      }

      if (parentMatches) {
        return [group];
      }

      if (matchingSpecialties.length > 0) {
        return [{ ...group, specialties: matchingSpecialties }];
      }

      return [];
    });
  }, [keyword, selectedDomain, topicGroups]);

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

      {filteredGroups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGroups.map(({ topic, specialties }) => (
            <div key={topic.slug} className="space-y-3">
              <TopicCard topic={topic} />
              {specialties.length > 0 && (
                <div className="ml-3 border-l-2 border-brand/15 pl-3">
                  <p className="mb-2 text-[11px] font-black tracking-[0.14em] text-stone-500">专项深读</p>
                  <div className="space-y-2">
                    {specialties.map(specialty => (
                      <TopicCard
                        key={specialty.slug}
                        topic={specialty}
                        variant="specialty"
                        parentTitle={topic.title}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
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
