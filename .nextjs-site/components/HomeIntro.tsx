import Link from 'next/link';
import { ChevronRightIcon } from '@/components/Icons';

export default function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-title"
      className="brand-soft-panel surface-card mb-6 overflow-hidden p-6 md:mb-8 md:px-10 md:py-8"
    >
      <div className="relative z-[1] max-w-3xl">
        <p className="mb-2.5 text-[10px] font-black tracking-[0.19em] text-brand md:mb-3 md:text-[11px]">
          BOOK NOTES · READING PATHS
        </p>
        <h1
          id="home-intro-title"
          className="text-3xl font-black leading-tight tracking-tight text-stone-950 md:text-5xl"
        >
          从一本书出发，<br className="sm:hidden" />读清一个问题
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700 md:mt-4 md:text-base md:leading-8">
          单本解读帮助你选书和复盘，主题阅读围绕一个问题串联多本书，形成一条理解路径。
        </p>
        <div className="mt-5 flex items-center gap-5 md:mt-6">
          <Link
            href="/topics"
            prefetch={false}
            data-home-module="topics"
            data-home-item-slug="all-topics"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-stone-950 px-5 text-sm font-bold text-[#fffdf8] shadow-[0_9px_18px_-13px_rgba(0,0,0,0.75)] transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
          >
            浏览主题阅读
            <ChevronRightIcon className="h-4 w-4 text-[#d7b47d]" />
          </Link>
          <Link
            href="/library"
            prefetch={false}
            data-home-module="library"
            data-home-item-slug="library"
            className="inline-flex min-h-12 items-center gap-1.5 text-sm font-bold text-stone-700 transition-colors hover:text-brand focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20"
          >
            进入书库
            <ChevronRightIcon className="h-4 w-4 text-brand" />
          </Link>
        </div>
      </div>
    </section>
  );
}
