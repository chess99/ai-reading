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
    <section aria-label="主题筛选" className="space-y-6">
      <div className="surface-card p-4 md:p-5">
        <label htmlFor="topic-search" className="sr-only">搜索主题</label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
          <input id="topic-search" type="search" value={keyword} onChange={event => setKeyword(event.target.value)}
            placeholder="搜索问题、主题或书名，例如：照护、物理、产品发现" className="input-brand" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {domains.map(domain => (
            <button key={domain} type="button" aria-pressed={selectedDomain === domain} onClick={() => setSelectedDomain(domain)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${selectedDomain === domain ? 'border-brand/40 bg-brand/15 text-brand' : 'border-stone-300/80 bg-[#fffdf8] text-stone-700 hover:border-brand/30 hover:text-brand'}`}>
              {domain}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">找到 {filteredTopics.length} 个主题</p>
      {filteredTopics.length ? (
        <div className="grid gap-4 md:grid-cols-2">{filteredTopics.map(topic => <TopicCard key={topic.slug} topic={topic} />)}</div>
      ) : (
        <div className="surface-card p-8 text-center">
          <h2 className="text-lg font-black text-stone-950">没有找到匹配的主题</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">试试换一个关键词，或切回全部领域。</p>
          <button type="button" onClick={() => { setKeyword(''); setSelectedDomain('全部'); }} className="btn-outline-brand mt-5">清空筛选</button>
        </div>
      )}
    </section>
  );
}
