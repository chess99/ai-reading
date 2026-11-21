'use client';

import { useMemo, useState } from 'react';
import TopicCard from '@/components/TopicCard';
import { SearchIcon } from '@/components/Icons';
import type { TopicMeta } from '@/lib/topics';
import { DOMAIN_ORDER, filterTopics } from '@/lib/topic-discovery';

export default function TopicsDiscovery({ topics }: { topics: TopicMeta[] }) {
  const [keyword, setKeyword] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('全部');
  const domains = useMemo(() => {
    const present = new Set(topics.flatMap(topic => topic.domains));
    return ['全部', ...DOMAIN_ORDER.filter(domain => present.has(domain)), ...[...present].filter(domain => !DOMAIN_ORDER.includes(domain))];
  }, [topics]);
  const filteredTopics = useMemo(() => filterTopics(topics, keyword, selectedDomain), [topics, keyword, selectedDomain]);

  return (
    <section aria-label="主题筛选">
      <div className="mb-3 flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">搜索主题</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
          <input type="search" value={keyword} onChange={event => setKeyword(event.target.value)}
            placeholder="搜索问题、主题或书名" className="input-brand" />
        </label>
        <select aria-label="主题领域" value={selectedDomain} onChange={event => setSelectedDomain(event.target.value)}
          className="min-h-11 shrink-0 rounded-lg border border-[rgba(79,58,35,0.14)] bg-(--color-field) px-3 text-sm font-medium text-stone-700 outline-none transition-colors hover:border-brand/35 focus:border-brand/70 focus:ring-4 focus:ring-brand/15">
          {domains.map(domain => <option key={domain} value={domain}>{domain === '全部' ? '全部领域' : domain}</option>)}
        </select>
      </div>
      <p className={keyword || selectedDomain !== '全部' ? 'py-2 text-sm text-stone-600' : 'sr-only'} role="status">
        找到 {filteredTopics.length} 个主题
      </p>
      {filteredTopics.length ? (
        <div className="grid gap-x-8 md:grid-cols-2">{filteredTopics.map(topic => <TopicCard key={topic.slug} topic={topic} />)}</div>
      ) : (
        <div className="py-10 text-center">
          <h2 className="text-lg font-bold text-stone-950">没有找到匹配的主题</h2>
          <p className="mt-2 text-sm text-stone-600">试试其他关键词或领域。</p>
          <button type="button" onClick={() => { setKeyword(''); setSelectedDomain('全部'); }} className="btn-outline-brand mt-5">清空筛选</button>
        </div>
      )}
    </section>
  );
}
