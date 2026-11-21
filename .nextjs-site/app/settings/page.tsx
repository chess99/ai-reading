import PageHeading from '@/components/PageHeading';
import type { Metadata } from 'next';
import SettingsContent from '@/components/SettingsContent';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: `设置 | ${BRAND_NAME}`,
  description: `${BRAND_NAME}离线缓存、存储管理与站点偏好设置。`,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${BASE_URL}/settings/`,
  },
};

export default function SettingsPage() {
  return (
    <div className="page-container">
      <div className="page-content-6xl">
        <PageHeading title="设置" description="离线阅读、存储与版本更新" />
        <div className="max-w-2xl"><SettingsContent /></div>
      </div>
    </div>
  );
}
