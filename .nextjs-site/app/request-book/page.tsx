import RequestBookForm from './RequestBookForm';

export const metadata = {
  title: '申请加入书库 - AI 阅读',
  description: '提交希望补充到 AI 阅读书库的书籍线索。',
};

export default function RequestBookPage() {
  return (
    <main className="mx-auto w-full px-0 py-0 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="border-b border-stone-200/70 bg-[#fffdf8]/80 px-5 py-4 backdrop-blur md:mb-4 md:rounded-lg md:border md:px-6 md:shadow-[0_12px_36px_-30px_rgba(79,58,35,0.55)]">
          <p className="text-xs font-black tracking-[0.16em] text-brand">BOOK REQUEST</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            提交希望补充到书库的书籍线索。已收录书籍可通过搜索页直接查找。
          </p>
        </div>
        <RequestBookForm />
      </div>
    </main>
  );
}
