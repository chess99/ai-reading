import fs from 'node:fs';

const groups = {
  'jin-rong-guai-jie': ['金融怪杰', 'Market Wizards', '杰克·施瓦格'],
  'ji-jing-de-chun-tian': ['寂静的春天', 'Rachel Carson', '蕾切尔·卡森'],
  'jin-zi-ta-yuan-li': ['金字塔原理', '芭芭拉·明托'],
  'tong-xiang-jin-rong-wang-guo-de-zi-you-zhi-lu': ['通向金融王国的自由之路', '通向财务自由之路', 'Trade Your Way to Financial Freedom', '范·K·撒普', 'Van Tharp'],
  'she-ji-xin-li-xue': ['设计心理学1', '设计心理学 日常的设计', '日常的设计', 'The Design of Everyday Things', 'Don Norman', '唐纳德·诺曼']
};

const decode = value => String(value || '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function parse(html) {
  const items = html.match(/<li class="wr_bookList_item">[\s\S]*?<\/li>/g) || [];
  return items.map(item => {
    const title = decode(item.match(/<p class="wr_bookList_item_title">([\s\S]*?)<\/p>/)?.[1]);
    const author = decode(item.match(/<p class="wr_bookList_item_author">([\s\S]*?)<\/p>/)?.[1]);
    const href = item.match(/href="([^"]*(?:bookDetail|reader)[^"]*)"/)?.[1] || '';
    const id = item.match(/[?&]amp;ii=([^"&]+)/)?.[1] || item.match(/[?&]ii=([^"&]+)/)?.[1] || href.match(/\/(?:bookDetail|reader)\/([^?"/]+)/)?.[1] || '';
    return { title, author, url: id ? `https://weread.qq.com/web/bookDetail/${id}` : '' };
  }).filter(x => x.title && x.url);
}

const out = {};
for (const [slug, queries] of Object.entries(groups)) {
  const seen = new Map();
  const errors = [];
  for (const query of queries) {
    try {
      const response = await fetch(`https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(query)}`, {
        headers: {
          'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
          'accept-language':'zh-CN,zh;q=0.9'
        }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      for (const item of parse(await response.text())) {
        if (!seen.has(item.url)) seen.set(item.url, {...item, queries:[query]});
        else seen.get(item.url).queries.push(query);
      }
    } catch (error) {
      errors.push(`${query}: ${String(error?.message || error)}`);
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  out[slug] = { queries, errors, results:[...seen.values()] };
  console.log(`\n## ${slug}`);
  for (const item of out[slug].results) console.log(JSON.stringify(item));
}
fs.writeFileSync('weread-extra-search.json', `${JSON.stringify(out, null, 2)}\n`);
