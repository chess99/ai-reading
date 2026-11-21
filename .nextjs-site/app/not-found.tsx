import Link from 'next/link';

const quickLinks = [
  { href: '/topics', label: '主题阅读', desc: '带着具体问题，从多本书里找阅读起点' },
  { href: '/library', label: '分类书库', desc: '按两级书架浏览全部已收录书籍解读' },
  { href: '/search', label: '全文搜索', desc: '按书名、作者或正文关键词快速检索' },
];

export default function NotFoundPage() {
  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <section>
          <div>
            <h1 className="page-title mb-4">找不到这个页面</h1>
            <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
              你访问的地址可能已迁移或输入有误。可以直接回到首页，或者从下面的入口重新查找想读的内容。
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
              <Link href="/" prefetch={false} className="btn-outline-brand inline-flex items-center justify-center">
                返回首页
              </Link>
              <Link
                href="/topics"
                prefetch={false}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-stone-200 px-5 font-semibold text-stone-700 transition-all hover:-translate-y-px hover:border-brand/40 hover:text-brand hover:bg-stone-50"
              >
                浏览主题阅读
              </Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href} prefetch={false} className="surface-card surface-card-hover block p-4">
                  <p className="text-sm font-bold text-stone-950">{link.label}</p>
                  <p className="mt-1 text-sm text-stone-500">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
