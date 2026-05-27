import RequestBookForm from './RequestBookForm';
import { BRAND_NAME } from '@/lib/brand';

export const metadata = {
  title: `申请加入书库 - ${BRAND_NAME}`,
  description: `提交希望补充到${BRAND_NAME}书库的书籍线索。`,
};

export default function RequestBookPage() {
  return (
    <main className="mx-auto w-full px-0 py-0 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="px-5 py-4 md:px-0 md:pb-6 md:pt-0">
          <p className="text-xs font-black tracking-[0.16em] text-brand">BOOK REQUEST</p>
          <p className="mt-2 text-sm leading-6 text-stone-600 md:text-base">
            提交希望补充到书库的书籍线索。已收录书籍可通过搜索页直接查找。
          </p>
        </div>
        <RequestBookForm />
      </div>
    </main>
  );
}
