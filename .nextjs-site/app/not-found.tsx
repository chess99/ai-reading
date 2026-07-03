import Link from 'next/link';

const quickLinks = [
  { href: '/', label: '返回首页', desc: '从首页重新开始浏览' },
  { href: '/search', label: '去搜索页', desc: '快速定位你想读的内容' },
];

export default function NotFoundPage() {
  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <section className="surface-card relative overflow-hidden">
          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <div className="mb-6 inline-flex items-center rounded-md border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-black tracking-wide text-brand">
              ERROR 404 · PAGE NOT FOUND
            </div>

            <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-stone-950 md:text-5xl">
              这个页面暂时迷路了
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
              你访问的路径不存在，可能链接已更新或地址输入有误。可以返回首页继续阅读，或使用搜索快速找到目标书籍与内容。
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
              <Link href="/" prefetch={false} className="btn-outline-brand inline-flex items-center justify-center">
                返回首页
              </Link>
              <Link
                href="/search"
                prefetch={false}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-stone-200 px-5 font-semibold text-stone-700 transition-all hover:-translate-y-px hover:border-brand/40 hover:text-brand hover:bg-stone-50"
              >
                前往搜索
              </Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-2">
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
