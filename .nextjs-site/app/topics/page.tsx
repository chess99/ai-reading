import type { Metadata } from 'next';
import TopicsDiscovery from '@/components/TopicsDiscovery';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';
import { getAllTopicMetas } from '@/lib/topics';

export const metadata: Metadata = {
  title: `主题阅读 | ${BRAND_NAME}`,
  description: '围绕真实问题组织阅读路径，帮你用一组关键书建立判断框架，逐步深入一个主题。',
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
            带着一个具体问题开始阅读：先建立判断框架，再沿着一组关键书逐层深入。
          </p>
        </div>

        <TopicsDiscovery topics={topics} />
      </div>
    </div>
  );
}
