import PageHeading from '@/components/PageHeading';
import Link from 'next/link';

export default function HomeIntro() {
  return (
    <PageHeading title="晨笙阅读" description="书籍解读与主题阅读">
      <div className="flex items-center gap-5 text-sm text-stone-600">
        <Link href="/topics" prefetch={false} data-home-module="topics" data-home-item-slug="all-topics"
          className="hidden min-h-11 items-center hover:text-brand md:inline-flex">浏览主题阅读</Link>
        <Link href="/library" prefetch={false} data-home-module="library" data-home-item-slug="library"
          className="hidden min-h-11 items-center hover:text-brand md:inline-flex">进入书库</Link>
        <Link href="/about" prefetch={false} data-home-module="about" data-home-item-slug="about"
          className="inline-flex min-h-11 items-center hover:text-brand" aria-label="关于晨笙阅读">关于</Link>
      </div>
    </PageHeading>
  );
}
