import Link from 'next/link';

const quickLinks = [
  { href: '/', label: '返回首页', desc: '从首页重新开始浏览' },
  { href: '/search', label: '去搜索页', desc: '快速定位你想读的内容' },
];

export default function NotFoundPage() {
  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />

          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-700">
              ERROR 404 · PAGE NOT FOUND
            </div>

            <h1 className="heading-gradient mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
              这个页面暂时迷路了
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              你访问的路径不存在，可能链接已更新或地址输入有误。可以返回首页继续阅读，或使用搜索快速找到目标书籍与内容。
            </p>

            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
              <Link href="/" className="btn-outline-brand inline-flex items-center justify-center">
                返回首页
              </Link>
              <Link
                href="/search"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 px-7 font-semibold text-slate-700 transition-all hover:-translate-y-px hover:border-indigo-300 hover:text-indigo-700 hover:shadow-[0_8px_20px_rgba(99,102,241,0.14)]"
              >
                前往搜索
              </Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {quickLinks.map(link => (
                <Link key={link.href} href={link.href} className="surface-card surface-card-hover block rounded-2xl p-4">
                  <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
