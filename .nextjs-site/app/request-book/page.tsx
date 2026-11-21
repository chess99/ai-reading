import PageHeading from '@/components/PageHeading';
import type { Metadata } from 'next';
import RequestBookForm from './RequestBookForm';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: `申请加入书库 - ${BRAND_NAME}`,
  description: `提交希望补充到${BRAND_NAME}书库的书籍线索。`,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${BASE_URL}/request-book/`,
  },
};

export default function RequestBookPage() {
  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <PageHeading title="申请加入书库" description="留下希望收录的书名与作者。" />
        <RequestBookForm />
      </div>
    </div>
  );
}
