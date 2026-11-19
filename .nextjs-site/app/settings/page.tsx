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
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <p className="text-xs font-black tracking-[0.16em] text-brand mb-2">PREFERENCES</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-stone-950">设置</h1>
        </div>
        <SettingsContent />
      </div>
    </div>
  );
}
