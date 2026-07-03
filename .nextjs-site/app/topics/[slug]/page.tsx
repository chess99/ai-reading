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
import { getAllTopicMetas, getTopicDetailBySlug } from '@/lib/topics';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopicMetas().map(topic => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicDetailBySlug(slug);

  if (!topic) {
    return {
      title: `主题未找到 - ${BRAND_NAME}`,
    };
  }

  const pageUrl = `${BASE_URL}/topics/${topic.slug}/`;

  return {
    title: `${topic.title}：主题阅读路径 | ${BRAND_NAME}`,
    description: topic.description,
    keywords: [topic.title, '主题阅读', '荐书', '书单', ...topic.tags],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${topic.title} - 主题阅读`,
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
  const topic = getTopicDetailBySlug(slug);

  if (!topic) {
    notFound();
  }

  const displayContent = topic.content.replace(/^\s*#\s+[^\n\r]+(?:\r?\n)+/, '');
  const pageUrl = `${BASE_URL}/topics/${topic.slug}/`;
  const recommendationCardBaseClass = 'block rounded-lg border border-stone-200/80 bg-[#fffdf8] p-4';
  const recommendationCardClass =
    `group ${recommendationCardBaseClass} cursor-pointer transition-all duration-200 hover:border-brand/35 hover:shadow-[0_16px_34px_-26px_rgba(79,58,35,0.55)]`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${topic.title}：主题阅读路径`,
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
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-black tracking-[0.16em] text-brand mb-3">TOPIC READING</p>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-stone-950">
                      {topic.title}
                    </h1>
                  </div>
                  <ShareButton
                    shareConfig={{
                      title: `${topic.title}：主题阅读路径`,
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
                      className="chip-brand hover:bg-brand hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
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
