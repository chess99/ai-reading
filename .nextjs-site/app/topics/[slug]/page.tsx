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
import { ChevronRightIcon } from '@/components/Icons';
import ShareButton from '@/components/ShareButton';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';
import {
  getAllTopicRouteSlugs,
  getTopicChildren,
  getTopicDetailBySlug,
  getTopicMergeBySlug,
} from '@/lib/topics';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopicRouteSlugs().map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const merge = getTopicMergeBySlug(slug);

  if (merge) {
    const target = getTopicDetailBySlug(merge.targetSlug);
    if (!target) {
      return {
        title: `主题未找到 - ${BRAND_NAME}`,
      };
    }

    const targetUrl = `${BASE_URL}/topics/${target.slug}/`;
    return {
      title: `${merge.title}已合并至${target.title} | ${BRAND_NAME}`,
      description: `“${merge.title}”已并入“${target.title}”，请沿新的主阅读路径继续阅读。`,
      alternates: {
        canonical: targetUrl,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const topic = getTopicDetailBySlug(slug);

  if (!topic) {
    return {
      title: `主题未找到 - ${BRAND_NAME}`,
    };
  }

  const pageUrl = `${BASE_URL}/topics/${topic.slug}/`;
  const pageType = topic.kind === 'specialty' ? '专项深读' : '主题阅读路径';

  return {
    title: `${topic.title}：${pageType} | ${BRAND_NAME}`,
    description: topic.description,
    keywords: [topic.title, '主题阅读', '荐书', '书单', ...topic.tags],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${topic.title} - ${pageType}`,
      description: topic.description,
      url: pageUrl,
      type: 'article',
      locale: 'zh_CN',
      siteName: BRAND_NAME,
      images: [
        {
          url: `${BASE_URL}/share-image.png`,
          width: 512,
          height: 512,
          alt: topic.title,
        },
      ],
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const merge = getTopicMergeBySlug(slug);

  if (merge) {
    const target = getTopicDetailBySlug(merge.targetSlug);
    if (!target) {
      notFound();
    }

    return (
      <article className="mx-auto w-full px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-3xl">
          <section className="surface-card px-6 py-10 md:px-10 md:py-12">
            <p className="text-xs font-black tracking-[0.16em] text-brand">TOPIC MERGED</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950">{merge.title}</h1>
            <p className="mt-5 text-base leading-8 text-stone-600">
              这个主题已经并入更完整的主阅读路径，不再作为独立主题维护。原来的核心问题和必要书目已经吸收到
              “{target.title}”中。
            </p>
            <Link
              href={`/topics/${target.slug}`}
              prefetch={false}
              className="btn-brand mt-7 inline-flex items-center gap-2"
            >
              前往《{target.title}》
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </article>
    );
  }

  const topic = getTopicDetailBySlug(slug);

  if (!topic) {
    notFound();
  }

  const parentTopic = topic.parentSlug ? getTopicDetailBySlug(topic.parentSlug) : null;
  const specialtyTopics = topic.kind === 'primary' ? getTopicChildren(topic.slug) : [];
  const displayContent = topic.content.replace(/^\s*#\s+[^\n\r]+(?:\r?\n)+/, '');
  const pageUrl = `${BASE_URL}/topics/${topic.slug}/`;
  const recommendationCardBaseClass = 'block rounded-lg border border-stone-200/80 bg-[#fffdf8] p-4';
  const recommendationCardClass =
    `group ${recommendationCardBaseClass} cursor-pointer transition-all duration-200 hover:border-brand/35 hover:shadow-[0_16px_34px_-26px_rgba(79,58,35,0.55)]`;
  const pageType = topic.kind === 'specialty' ? '专项深读' : '主题阅读路径';
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${topic.title}：${pageType}`,
    description: topic.description,
    url: pageUrl,
    inLanguage: 'zh-CN',
    datePublished: new Date(topic.date).toISOString(),
    dateModified: new Date(topic.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: BASE_URL,
    },
    keywords: ['主题阅读', '荐书', ...topic.tags].join(', '),
  };

  return (
    <article className="mx-auto w-full px-4 py-6 md:px-8 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 xl:gap-12">
          <div className="min-w-0 flex-1">
            <section className="surface-card px-5 py-7 md:px-9 md:py-10 lg:px-12 lg:py-12">
              <div className="mb-8 border-b border-stone-200 pb-6">
                {parentTopic && (
                  <Link
                    href={`/topics/${parentTopic.slug}`}
                    prefetch={false}
                    className="mb-4 inline-flex items-center gap-2 text-xs font-black tracking-[0.08em] text-brand hover:underline"
                  >
                    专项深读
                    <span className="font-semibold tracking-normal text-stone-500">主线：{parentTopic.title}</span>
                  </Link>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-black tracking-[0.16em] text-brand mb-3">
                      {topic.kind === 'specialty' ? 'SPECIALTY READING' : 'TOPIC READING'}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-stone-950">
                      {topic.title}
                    </h1>
                  </div>
                  <ShareButton
                    shareConfig={{
                      title: `${topic.title}：${pageType}`,
                      text: topic.description,
                      url: pageUrl,
                      eventAction: 'share_topic',
                      eventLabel: topic.title,
                    }}
                    className="hidden md:inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-[#fffdf8] px-3 text-sm font-semibold text-stone-700 transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand active:scale-95"
                    iconClassName="h-4 w-4"
                    showLabel
                  />
                </div>
                <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-stone-600">{topic.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {topic.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}&tab=books`}
                      prefetch={false}
                      className="chip-brand hover:bg-brand hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {specialtyTopics.length > 0 && (
                  <div className="mt-6 rounded-lg border border-brand/15 bg-brand/[0.04] p-4">
                    <p className="text-[11px] font-black tracking-[0.14em] text-brand">专项深读</p>
                    <div className="mt-3 space-y-2">
                      {specialtyTopics.map(specialty => (
                        <Link
                          key={specialty.slug}
                          href={`/topics/${specialty.slug}`}
                          prefetch={false}
                          className="group flex items-center justify-between gap-4 rounded-lg border border-stone-200/80 bg-[#fffdf8] px-4 py-3 hover:border-brand/30"
                        >
                          <div className="min-w-0">
                            <p className="font-black text-stone-900 group-hover:text-brand">{specialty.title}</p>
                            <p className="mt-1 line-clamp-1 text-xs text-stone-500">{specialty.description}</p>
                          </div>
                          <span className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-bold text-stone-500">
                            {specialty.bookCount} 本
                            <ChevronRightIcon className="h-3.5 w-3.5 text-brand" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex, rehypeHighlight]}
                  components={{
                    table: ({ children, ...props }) => (
                      <div className="markdown-table-wrapper">
                        <table {...props}>{children}</table>
                      </div>
                    ),
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 lg:w-80 xl:w-96 flex-shrink-0">
            <div className="surface-card p-5 md:p-6">
              <div className="mb-5">
                <p className="text-[11px] font-black tracking-[0.16em] text-brand mb-2">READING PATH</p>
                <h2 className="text-xl font-black tracking-tight text-stone-950">荐读路径</h2>
              </div>
              <div className="space-y-3">
                {topic.books.map((book, index) => {
                  const linkedBook = book.status === 'in_library' && book.book ? book.book : null;
                  const cardContent = (
                    <>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <span className="chip-muted text-[11px]">{book.role}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-400">
                          {String(index + 1).padStart(2, '0')}
                          {linkedBook && (
                            <ChevronRightIcon className="h-3.5 w-3.5 text-brand opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                          )}
                        </span>
                      </div>
                      <h3 className="font-black leading-snug text-stone-950 transition-colors group-hover:text-brand">
                        《{book.title}》
                      </h3>
                      <p className="mt-1 text-xs text-stone-500">{book.author}</p>
                      <p className="mt-3 text-sm leading-6 text-stone-600">{book.reason}</p>
                    </>
                  );

                  if (linkedBook) {
                    return (
                      <Link
                        key={`${book.title}-${index}`}
                        href={`/books/${linkedBook.slug}`}
                        prefetch={false}
                        className={recommendationCardClass}
                        aria-label={`打开《${book.title}》`}
                      >
                        {cardContent}
                      </Link>
                    );
                  }

                  return (
                    <div key={`${book.title}-${index}`} className={recommendationCardBaseClass}>
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
