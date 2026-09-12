import type { Metadata } from 'next';
import TopicsDiscovery from '@/components/TopicsDiscovery';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';
import { getAllTopicMetas } from '@/lib/topics';

export const metadata: Metadata = {
  title: `主题阅读 | ${BRAND_NAME}`,
  description: '按问题选读，比较不同观点，或从一部作品进入新的经验。找到适合自己的起点。',
  alternates: {
    canonical: `${BASE_URL}/topics/`,
  },
};

export default function TopicsPage() {
  const topics = getAllTopicMetas();

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        <div className="mb-8 md:mb-10">
          <p className="text-xs font-black tracking-[0.16em] text-brand mb-2">TOPICS</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-950">主题阅读</h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-stone-600">
            带着问题选书，也可以从一部作品开始。找到起点，再按需要读下去。
          </p>
        </div>

        <TopicsDiscovery topics={topics} />
      </div>
    </div>
  );
}
