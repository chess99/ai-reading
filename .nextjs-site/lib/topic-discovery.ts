import type { TopicMeta } from './topics';
export const DOMAIN_ORDER = ['思维', '学习', '心理', '关系', '职业', '商业', '金钱', '社会', '历史', '科学', '科技', '人文', '健康'];
export const TOPIC_MODE_LABELS = { path: '按问题选读', comparison: '比较不同观点', collection: '作品与经验' } as const;
export const READING_LABELS = { start: '从这里开始', next: '继续阅读', compare: '对照阅读', optional: '按需选读', reference: '查阅与深入' } as const;
export function normalizeTopicSearch(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}
export function filterTopics(topics: TopicMeta[], query: string, domain = '全部'): TopicMeta[] {
  const terms = normalizeTopicSearch(query).split(' ').filter(Boolean);
  return topics.filter(topic => (domain === '全部' || topic.domains.includes(domain)) &&
    terms.every(term => normalizeTopicSearch(`${topic.title} ${topic.description} ${topic.entry} ${topic.searchText}`).includes(term)));
}
