import Link from 'next/link';

const useCases = [
  {
    title: '选书',
  },
  {
    title: '复盘',
  },
  {
    title: '主题学习',
  },
];

export default function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-title"
      className="brand-soft-panel surface-card mb-6 overflow-hidden p-5 md:mb-8 md:p-7"
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="mb-2 text-[11px] font-black tracking-[0.18em] text-brand">
            BOOK NOTES · READING PATHS
          </p>
          <h1
            id="home-intro-title"
            className="max-w-3xl text-2xl font-black leading-tight tracking-tight text-stone-950 md:text-4xl"
          >
            先看清一本书，再决定怎样读
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700 md:text-base md:leading-7">
            用单本解读判断是否值得精读，也用主题路径把多本书串成一个问题。适合阅读前选书、阅读后复盘，或开始一次主题学习。
          </p>
        </div>
        <div className="space-y-4 md:min-w-[280px]">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-stone-700 md:justify-end" aria-label="阅读用途">
            {useCases.map(item => (
              <li key={item.title} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                {item.title}
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
            <Link
              href="/topics"
              prefetch={false}
              data-home-module="topics"
              data-home-item-slug="all-topics"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 px-4 text-sm font-bold text-brand transition-colors hover:border-brand/50 hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
            >
              浏览主题
            </Link>
            <Link
              href="/library"
              prefetch={false}
              data-home-module="library"
              data-home-item-slug="library"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-[#fffdf8] px-4 text-sm font-bold text-stone-800 transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
            >
              进入书库
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
