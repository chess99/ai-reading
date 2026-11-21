import PageHeading from '@/components/PageHeading';
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
  openGraph: {
    title: `主题阅读 | ${BRAND_NAME}`,
    description: '按问题选读，比较不同观点，或从一部作品进入新的经验。找到适合自己的起点。',
    url: `${BASE_URL}/topics/`,
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function TopicsPage() {
  const topics = getAllTopicMetas();

  return (
    <div className="page-container">
      <div className="page-content-6xl">
        <PageHeading title="主题阅读" description={`${topics.length} 个主题书单，按问题或领域选读`} />
        <TopicsDiscovery topics={topics} />
      </div>
    </div>
  );
}
