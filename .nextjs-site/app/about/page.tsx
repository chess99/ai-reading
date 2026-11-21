import PageHeading from '@/components/PageHeading';
import type { Metadata } from 'next';
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
  isPartOf: {
    '@id': `${BASE_URL}/#website`,
  },
  mainEntity: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: BRAND_NAME,
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/icon-512.png`,
    founder: {
      '@type': 'Person',
      '@id': 'https://cearl.cc/#person',
      name: '晨笙',
      alternateName: 'Cearl',
      url: 'https://cearl.cc/',
    },
    sameAs: [
      'https://github.com/chess99/ai-reading',
    ],
  },
  publisher: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: BRAND_NAME,
    url: `${BASE_URL}/`,
  },
  about: ['书籍解读', '读书笔记', 'AI 辅助阅读', '人工校审'],
};

const relationshipPoints = [
  {
    title: '阅读前',
    body: '先摸清一本书探讨的核心议题、切入角度和适用范围，决定是否值得投入时间精读。',
  },
  {
    title: '阅读后',
    body: '重温全书脉络、关键证据或故事走向，把散落的笔记和记忆重新串联起来。',
  },
  {
    title: '主题学习',
    body: '通过跨书主题索引，沿着一个真实问题找到不同立场、相互补充的下一本书。',
  },
];

const useCases = [
  {
    title: '选书',
    body: '快速看清一本书到底写了什么、适合什么基础的读者，减少只凭书名和短评盲选的试错。',
  },
  {
    title: '复盘',
    body: '读完厚书或复杂故事后回顾核心论证与关键细节，加深对全书结构的把握。',
  },
  {
    title: '主题阅读',
    body: '围绕一个具体困扰或研究议题并读多本书，把互相印证和争锋的观点放到同一张桌上对照。',
  },
  {
    title: '概念搜索',
    body: '用全文搜索查找某个概念、人物或事件在不同作品中的讨论与线索。',
  },
];

const processSteps = [
  {
    title: '基于完整原书起草',
    body: '通读完整原书后依体裁组织结构：非虚构作品保留问题、论证、案例与成立条件；小说与戏剧写出连贯的人物处境、抉择与结局；诗歌与随笔依实际篇章语境展开。',
  },
  {
    title: '人工校审与去模板打磨',
    body: '对照原书文本核查事实、数字与人物关系，清理空泛套话、机械对比句和生硬的免责腔，确保语言干净好读。',
  },
];

const standards = [
  {
    title: '准确性',
    body: '紧贴原书文本，如实交代结论与边界，不编造书中没有的概念、数据和经历。',
  },
  {
    title: '清晰度',
    body: '用平实、有信息量的中文重写复杂内容，尽量让未读过原著的读者也能一口气读懂。',
  },
  {
    title: '贴合体裁',
    body: '依作品自身逻辑分段立题，让实用方法、学术论证与文学叙事各自保住本色，不套八股清单。',
  },
  {
    title: '完整性',
    body: '覆盖全书主要章节与关键情节，呈现作者展开推理或讲完故事的完整过程。',
  },
  {
    title: '有见地的取舍',
    body: '突出真正撑起全书的洞察、人物细节与思想张力，兼顾深度和阅读节奏。',
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
        <section className="mb-8">
          <PageHeading title={`关于${BRAND_NAME}`} />
          <p className="max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
            {BRAND_NAME}是{BRAND_TAGLINE}，收录商业、投资、心理学、科学、历史与人文文学等领域的好书。无论是决定要不要花十几个小时精读一本厚书，还是读完后重温脉络、顺着一个具体问题跨书对照，这里都试图给你一份扎实、好读的参照。
          </p>
        </section>

        <section className="mb-10">
          <div className="surface-card border-l-4 border-l-brand p-5 md:p-6">
            <h2 className="mb-3 text-xl font-black tracking-tight text-stone-950">与原书的关系</h2>
            <p className="max-w-3xl text-sm leading-7 text-stone-700 md:text-base">
              书籍解读不能完全替代原书。它更适合作为阅读前的地图、阅读后的复盘，或主题学习时的索引。真正重要的书，仍然值得回到原文细读。
            </p>
            <div className="mt-5 grid gap-4 border-t border-stone-200 pt-5 md:grid-cols-3">
              {relationshipPoints.map(item => (
                <div key={item.title}>
                  <h3 className="mb-1 text-sm font-black text-stone-950">{item.title}</h3>
                  <p className="text-sm leading-6 text-stone-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-5">你可以这样用</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {useCases.map((item) => (
              <article key={item.title} className="surface-card p-5">
                <h3 className="mb-2 text-base font-black text-stone-950">{item.title}</h3>
                <p className="text-sm leading-7 text-stone-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-5">内容如何整理</h2>
          <div className="surface-card p-5 md:p-6">
            <p className="mb-5 text-sm leading-7 text-stone-700 md:text-base">
              {CONTENT_PROCESS_SUMMARY}
            </p>
            <div className="grid gap-4 border-t border-stone-200 pt-5 md:grid-cols-2">
              {processSteps.map(item => (
                <div key={item.title}>
                  <h3 className="mb-2 text-base font-black text-stone-950">{item.title}</h3>
                  <p className="text-sm leading-7 text-stone-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-5">质量标准</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {standards.map(item => (
              <article key={item.title} className="surface-card p-5">
                <h3 className="mb-2 text-base font-bold text-stone-950">{item.title}</h3>
                <p className="text-sm leading-7 text-stone-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
