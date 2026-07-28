import Link from 'next/link';

const useCases = [
  {
    number: '01',
    title: '选书',
    description: '先看清一本书讨论的问题，再判断是否值得精读。',
  },
  {
    number: '02',
    title: '复盘',
    description: '读完之后找回核心框架、关键判断和论证线索。',
  },
  {
    number: '03',
    title: '主题学习',
    description: '沿着一个真实问题，把分散在不同书里的观点连起来。',
  },
];

export default function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-title"
      className="brand-soft-panel surface-card mb-8 overflow-hidden p-6 md:mb-10 md:p-9 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-end">
        <div>
          <p className="mb-4 text-[11px] font-black tracking-[0.18em] text-brand">
            BOOK NOTES · READING PATHS
          </p>
          <h1
            id="home-intro-title"
            className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-stone-950 md:text-5xl"
          >
            先看清一本书，再决定怎样读
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-700 md:text-base md:leading-8">
            晨笙阅读把单本书的核心问题与论证框架讲清楚，也把多本书组织成围绕真实问题的阅读路径。用于阅读前选书、阅读后复盘，或开始一次主题学习。
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 lg:hidden" aria-label="阅读用途">
            {useCases.map(item => (
              <span
                key={item.title}
                className="rounded-md border border-stone-900/10 bg-[#fffdf8]/75 px-2 py-2 text-center text-xs font-bold text-stone-800"
              >
                {item.title}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/topics"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-stone-950 px-5 text-sm font-bold text-[#fffdf8] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
            >
              从主题阅读开始
            </Link>
            <Link
              href="/library"
              prefetch={false}
              className="btn-outline-brand inline-flex items-center justify-center text-sm"
            >
              浏览全部书籍
            </Link>
          </div>
        </div>

        <div className="hidden gap-3 lg:grid">
          {useCases.map(item => (
            <div
              key={item.title}
              className="rounded-lg border border-stone-900/10 bg-[#fffdf8]/75 px-4 py-3.5"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-black tracking-[0.14em] text-brand">
                  {item.number}
                </span>
                <h2 className="text-sm font-black text-stone-950">{item.title}</h2>
              </div>
              <p className="mt-1.5 pl-7 text-xs leading-5 text-stone-600 md:text-sm md:leading-6">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
