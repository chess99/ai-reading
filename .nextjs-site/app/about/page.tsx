import type { Metadata } from 'next';
import Link from 'next/link';
import { BASE_URL } from '@/lib/config';
import { BRAND_NAME, BRAND_TAGLINE, CONTENT_PROCESS_SUMMARY } from '@/lib/brand';

export const metadata: Metadata = {
  title: `关于${BRAND_NAME} | ${BRAND_TAGLINE}`,
  description: `${BRAND_NAME}是${BRAND_TAGLINE}，收录商业、投资、心理学、思维方式、健康、写作等领域的好书解读。`,
  alternates: {
    canonical: `${BASE_URL}/about/`,
  },
  openGraph: {
    title: `关于${BRAND_NAME}`,
    description: CONTENT_PROCESS_SUMMARY,
    url: `${BASE_URL}/about/`,
    siteName: BRAND_NAME,
    type: 'article',
    locale: 'zh_CN',
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `关于${BRAND_NAME}`,
  description: `${BRAND_NAME}是${BRAND_TAGLINE}。${CONTENT_PROCESS_SUMMARY}`,
  url: `${BASE_URL}/about/`,
  inLanguage: 'zh-CN',
  publisher: {
    '@type': 'Organization',
    name: BRAND_NAME,
    url: BASE_URL,
  },
  about: ['书籍解读', '读书笔记', 'AI 辅助阅读', '人工校审'],
};

const useCases = [
  '快速判断一本书是否值得精读',
  '读完一本书后回顾核心观点',
  '围绕商业、投资、心理学等主题连续阅读',
  '搜索某个概念在哪些书里出现过',
];

const standards = [
  {
    title: '准确性',
    body: '尽量忠实反映原书主要观点，不制造书中没有的概念、数据和案例。',
  },
  {
    title: '清晰度',
    body: '用更清楚的语言重组内容，让读者能抓住问题、框架和结论。',
  },
  {
    title: '结构性',
    body: '先给出核心判断，再展开关键框架、案例、机制和实践启发。',
  },
  {
    title: '完整性',
    body: '覆盖一本书的主要内容，不只摘几个有传播感的金句。',
  },
  {
    title: '洞察性',
    body: '保留提炼者视角，不把书简单压缩成章节目录或知识点清单。',
  },
];

export default function AboutPage() {
  return (
    <div className="page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="page-content-4xl">
        <section className="mb-10 border-b border-slate-200 pb-8">
          <p className="mb-3 text-xs font-black tracking-[0.18em] text-brand">ABOUT</p>
          <h1 className="mb-5 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            关于{BRAND_NAME}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
            {BRAND_NAME}是{BRAND_TAGLINE}，收录商业、投资、心理学、思维方式、健康、写作等领域的好书解读。这里的目标不是替代原书，而是帮你更快把一本书的核心问题、论证框架和可实践洞见看清楚。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-5">适合怎样使用</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {useCases.map(item => (
              <div key={item} className="surface-card p-4">
                <p className="text-sm font-semibold leading-6 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-5">内容如何整理</h2>
          <div className="surface-card p-5 md:p-6">
            <p className="text-sm leading-7 text-slate-700 md:text-base">
              {CONTENT_PROCESS_SUMMARY}人工校审主要关注：内容是否忠实，主线是否清楚，案例是否具体，是否存在明显幻觉或空泛总结。
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-5">质量标准</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {standards.map(item => (
              <article key={item.title} className="surface-card p-5">
                <h3 className="mb-2 text-base font-bold text-slate-950">{item.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 surface-card p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">与原书的关系</h2>
          <p className="text-sm leading-7 text-slate-700 md:text-base">
            书籍解读不能完全替代原书。它更适合作为阅读前的地图、阅读后的复盘，或主题学习时的索引。真正重要的书，仍然值得回到原文细读。
          </p>
        </section>

        <section className="surface-card p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-950">反馈与申请书籍</h2>
          <p className="mb-5 text-sm leading-7 text-slate-700 md:text-base">
            如果你发现内容错误、表述不清，或希望补充某本书，可以提交反馈或申请加入书库。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/request-book" className="btn-outline-brand inline-flex h-11 items-center justify-center px-5">
              申请加入书库
            </Link>
            <Link href="/search" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand hover:text-brand">
              搜索书库
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
