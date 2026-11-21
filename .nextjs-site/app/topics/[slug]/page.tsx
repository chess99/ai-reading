import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';
import ShareButton from '@/components/ShareButton';
import TopicBookCard from '@/components/TopicBookCard';
import TopicCard from '@/components/TopicCard';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';
import { TOPIC_MODE_LABELS } from '@/lib/topic-discovery';
import { remarkTopicBookLinks } from '@/lib/topic-book-links';
import { rehypeSearchAnchors } from '@/lib/search-anchors.mjs';
import SearchHighlights from '@/components/SearchHighlights';
import { getAllTopicRouteSlugs, getTopicDetailBySlug, getTopicLegacyRoute, getRelatedTopics } from '@/lib/topics';
import { getContentVersion } from '@/lib/build-info';
interface TopicPageProps { params: Promise<{ slug: string }>; }
export async function generateStaticParams() { return getAllTopicRouteSlugs().map(slug => ({ slug })); }
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const legacy = getTopicLegacyRoute(slug);
  if (legacy) {
    const target = legacy.targets.length === 1 ? getTopicDetailBySlug(legacy.targets[0]) : null;
    return { title: `${legacy.title} | ${BRAND_NAME}`, robots: { index: false, follow: true },
      alternates: { canonical: `${BASE_URL}/topics/${target?.slug || slug}/` } };
  }
  const topic = getTopicDetailBySlug(slug);
  if (!topic) return { title: `主题未找到 - ${BRAND_NAME}` };
  const url = `${BASE_URL}/topics/${topic.slug}/`;
  return { title: `${topic.title} | ${BRAND_NAME}`, description: topic.description,
    other: { 'ai-reading-content': getContentVersion(`/topics/${topic.slug}/`) },
    keywords: [topic.title, '主题阅读', ...topic.tags], alternates: { canonical: url },
    openGraph: { title: topic.title, description: topic.description, url, type: 'article', locale: 'zh_CN', siteName: BRAND_NAME,
      images: [{ url: `${BASE_URL}/share-image.png?v=5`, width: 512, height: 512, alt: topic.title }] } };
}
export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const legacy = getTopicLegacyRoute(slug);
  if (legacy) {
    const targets = legacy.targets.flatMap(target => { const topic = getTopicDetailBySlug(target); return topic ? [topic] : []; });
    if (!targets.length) notFound();
    return <article className="page-container"><div className="mx-auto max-w-3xl py-8">
      <h1 className="page-title">{legacy.title}</h1>
      <p className="my-6 leading-7 text-stone-600">{targets.length === 1 ? '继续阅读这个主题：' : '选择你想了解的问题：'}</p>
      <div className="space-y-4">{targets.map(topic => <TopicCard key={topic.slug} topic={topic} variant="card" />)}</div>
      <Link href="/topics/" className="mt-6 inline-block text-sm font-bold text-brand">浏览全部主题</Link>
    </div></article>;
  }
  const topic = getTopicDetailBySlug(slug);
  if (!topic) notFound();
  const related = getRelatedTopics(topic);
  const content = topic.content.replace(/^\s*#\s+[^\n\r]+(?:\r?\n)+/, '');
  const starters = topic.books.map((book, index) => ({ book, index })).filter(item => item.book.reading === 'start');
  const url = `${BASE_URL}/topics/${topic.slug}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.description,
    url,
    inLanguage: 'zh-CN',
    dateModified: topic.date,
    isPartOf: { '@id': `${BASE_URL}/#website`, '@type': 'WebSite', name: BRAND_NAME, url: `${BASE_URL}/` },
    author: { '@type': 'Organization', '@id': `${BASE_URL}/#organization`, name: BRAND_NAME, url: `${BASE_URL}/` },
    publisher: { '@type': 'Organization', '@id': `${BASE_URL}/#organization`, name: BRAND_NAME, url: `${BASE_URL}/` },
  };
  return <article className="reading-page mx-auto w-full">
    <SearchHighlights />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <div className="mx-auto max-w-7xl">
      <Link href="/topics/" prefetch={false} className="mb-5 hidden text-sm font-semibold text-brand md:inline-block">← 全部主题</Link>
      <div className="topic-reading-layout">
        <div className="min-w-0 flex-1">
          <section data-pagefind-body className="reader-card surface-card">
            <header className="border-b border-[#e4dccf] pb-6">
              <p data-pagefind-ignore className="mb-3 text-xs font-bold text-brand">{topic.domains.join(' · ')} <span className="mx-2 text-stone-300">/</span> {TOPIC_MODE_LABELS[topic.mode]}</p>
              <div className="flex items-start justify-between gap-4">
                <h1 data-pagefind-meta="title" data-pagefind-weight="5" className="page-title break-words">{topic.title}</h1>
                <ShareButton shareConfig={{ title: topic.title, text: topic.description, url, eventAction: 'share_topic', eventLabel: topic.title }}
                  className="hidden h-10 flex-shrink-0 items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-700 md:inline-flex"
                  iconClassName="h-4 w-4" showLabel />
              </div>
              <p className="mt-4 text-base leading-7 text-stone-600">{topic.description}</p>
              <p className="mt-4 text-xs text-stone-500">书单 {topic.bookCount} 本 · 解读 {topic.availableCount} 本可读</p>
            </header>
            <section aria-labelledby="starting-books" className="my-7 rounded-xl border border-[#e4dccf] bg-(--color-surface-muted)/60 p-4 md:p-5">
              <h2 id="starting-books" className="text-lg font-black text-stone-950">从这里开始</h2>
              <p className="mb-4 mt-2 text-sm leading-6 text-stone-600">{topic.entry}</p>
              <div className={`grid gap-3 ${starters.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {starters.map(({ book, index }) => <TopicBookCard key={book.title} book={book} index={index} entry />)}
              </div>
              <a href="#reading-list" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">查看完整书单与读法 ↓</a>
            </section>
            <div data-search-content className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, [remarkTopicBookLinks, topic.books]]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSearchAnchors, rehypeKatex, rehypeHighlight]}
                components={{ a: ({ href, children }) => href?.startsWith('/books/') ? <Link href={href} prefetch={false}>{children}</Link> : <a href={href}>{children}</a>,
                  table: ({ children, ...props }) => <div className="markdown-table-wrapper"><table {...props}>{children}</table></div> }}>
                {content}
              </ReactMarkdown>
            </div>
          </section>
        </div>
        <aside id="reading-list" aria-label="完整书单" className="topic-reading-list min-w-0 scroll-mt-6">
          <div className="surface-card bg-(--color-surface-muted)/45 p-5 md:p-6">
            <h2 className="mb-5 text-xl font-black text-stone-950">书单与读法</h2>
            <div className="space-y-3">{topic.books.map((book, index) => <TopicBookCard key={`${book.title}-${book.author}`} book={book} index={index} />)}</div>
          </div>
        </aside>
      </div>
      {related.length > 0 && <section aria-labelledby="related-topics" className="mt-7">
        <h2 id="related-topics" className="mb-4 text-xl font-black text-stone-950">继续探索</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{related.map(item => <TopicCard key={item.slug} topic={item} variant="card" />)}</div>
      </section>}
    </div>
  </article>;
}
