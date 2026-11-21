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
    <main className="mx-auto w-full px-0 py-0 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="px-5 py-4 md:px-0 md:pb-6 md:pt-0">
          <p className="text-xs font-black tracking-[0.16em] text-brand">BOOK REQUEST</p>
          <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-stone-950">申请加入书库</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600 md:text-base">
            遇到想看却尚未收录的书，可以在下方留下书名与作者。已收录书籍请直接前往搜索页或书库查看。
          </p>
        </div>
        <RequestBookForm />
      </div>
    </main>
  );
}
