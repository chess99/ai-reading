import type { Metadata } from 'next';
import CopyFeedButton from '@/components/CopyFeedButton';
import { BRAND_NAME } from '@/lib/brand';
import { BASE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: `订阅收听 | ${BRAND_NAME}`,
  description: `通过全文 RSS 在支持文字朗读的阅读器中订阅并收听${BRAND_NAME}。`,
  alternates: {
    canonical: `${BASE_URL}/listen/`,
  },
};

const feeds = [
  {
    title: '最新内容',
    description: '书籍解读与主题阅读混合更新。日常只订阅这一个就够了。',
    url: `${BASE_URL}/feed.xml`,
  },
  {
    title: '书籍解读',
    description: '最近 100 篇书籍解读，正文完整包含在 RSS 中。',
    url: `${BASE_URL}/feeds/books.xml`,
  },
  {
    title: '主题阅读',
    description: '主题阅读路径单独订阅，适合连续听一个问题下的阅读策展。',
    url: `${BASE_URL}/feeds/topics.xml`,
  },
];

const clients = ['Speech Central', 'Inoreader', 'PetalFeed', 'SmartRSS'];

export default function ListenPage() {
  const opmlUrl = `${BASE_URL}/feeds/ai-reading.opml`;

  return (
    <div className="page-container">
      <div className="page-content-4xl">
        <section className="mb-8 border-b border-stone-200 pb-8">
          <p className="mb-3 text-xs font-black tracking-[0.18em] text-brand">LISTEN WITH RSS</p>
          <h1 className="mb-5 text-3xl font-black leading-tight text-stone-950 md:text-5xl">把文字交给你喜欢的朗读器</h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
            {BRAND_NAME}提供标准的全文 RSS，不预生成音频。把下面的地址添加到支持 RSS 与文字转语音的客户端，客户端即可直接朗读正文。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-4">推荐订阅</h2>
          <div className="space-y-3">
            {feeds.map(feed => (
              <article key={feed.url} className="surface-card p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h3 className="mb-1 text-base font-black text-stone-950">{feed.title}</h3>
                    <p className="text-sm leading-6 text-stone-600">{feed.description}</p>
                    <code className="mt-3 block overflow-x-auto rounded-md bg-stone-100 px-3 py-2 text-xs text-stone-700">{feed.url}</code>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <CopyFeedButton value={feed.url} />
                    <a
                      href={feed.url}
                      className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-3 py-2 text-sm font-bold text-[#fffdf8] transition-colors hover:bg-stone-800"
                    >
                      打开 RSS
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <article className="surface-card p-5 md:p-6">
            <p className="mb-2 text-[11px] font-black tracking-[0.16em] text-brand">CLIENTS</p>
            <h2 className="mb-3 text-xl font-black text-stone-950">可用于哪些客户端</h2>
            <p className="mb-4 text-sm leading-7 text-stone-600">
              只要客户端能订阅标准 RSS 并朗读文章正文即可。当前可以优先尝试：
            </p>
            <div className="flex flex-wrap gap-2">
              {clients.map(client => (
                <span key={client} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-semibold text-stone-700">
                  {client}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-stone-500">
              在客户端中选择“添加 RSS / Feed / Subscription”，粘贴上面的地址。不同版本的菜单名称可能略有差异。
            </p>
          </article>

          <article className="surface-card p-5 md:p-6">
            <p className="mb-2 text-[11px] font-black tracking-[0.16em] text-brand">FULL LIBRARY</p>
            <h2 className="mb-3 text-xl font-black text-stone-950">导入完整旧书库</h2>
            <p className="text-sm leading-7 text-stone-600">
              为避免单个 RSS 过大，日常 Feed 只保留最近内容；完整书库按一级书架拆成分类 Feed。支持 OPML 的客户端可以一次导入全部分类与主题阅读。
            </p>
            <code className="mt-3 block overflow-x-auto rounded-md bg-stone-100 px-3 py-2 text-xs text-stone-700">{opmlUrl}</code>
            <div className="mt-4 flex gap-2">
              <CopyFeedButton value={opmlUrl} />
              <a
                href={opmlUrl}
                className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-3 py-2 text-sm font-bold text-[#fffdf8] transition-colors hover:bg-stone-800"
              >
                下载 OPML
              </a>
            </div>
          </article>
        </section>

        <section className="surface-card border-l-4 border-l-brand p-5 md:p-6">
          <h2 className="mb-2 text-lg font-black text-stone-950">这不是播客音频源</h2>
          <p className="text-sm leading-7 text-stone-600">
            Feed 中没有 MP3，也没有音频 enclosure；每一条订阅都直接包含完整 HTML 正文。声音、倍速、后台播放和离线能力由你选择的客户端负责，因此本站不需要保存或重新生成音频文件。
          </p>
        </section>
      </div>
    </div>
  );
}
