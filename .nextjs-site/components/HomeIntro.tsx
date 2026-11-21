import Link from 'next/link';

export default function HomeIntro() {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-x-4 border-b border-stone-300/70 pb-4 md:mb-8 md:pb-6">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-wide text-stone-950 md:text-4xl">晨笙阅读</h1>
        <p className="mt-1.5 text-sm text-stone-600">书籍解读与主题阅读</p>
      </div>
      <div className="flex items-center gap-5 text-sm text-stone-600">
        <Link href="/topics" prefetch={false} data-home-module="topics" data-home-item-slug="all-topics"
          className="hidden min-h-11 items-center hover:text-brand md:inline-flex">浏览主题阅读</Link>
        <Link href="/library" prefetch={false} data-home-module="library" data-home-item-slug="library"
          className="hidden min-h-11 items-center hover:text-brand md:inline-flex">进入书库</Link>
        <Link href="/about" prefetch={false} data-home-module="about" data-home-item-slug="about"
          className="inline-flex min-h-11 items-center hover:text-brand" aria-label="关于晨笙阅读">关于</Link>
      </div>
    </header>
  );
}
