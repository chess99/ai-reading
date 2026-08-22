import fs from 'node:fs';

const candidates = [
  ['jin-rong-guai-jie-2018', 'https://weread.qq.com/web/bookDetail/a25326b0715a4f2ea255814'],
  ['jin-rong-guai-jie-2015', 'https://weread.qq.com/web/bookDetail/0fc32b90813ab9a57g018df7'],
  ['jin-rong-guai-jie-en', 'https://weread.qq.com/web/bookDetail/f86323a0811e1cf05g015351'],
  ['tong-xiang-jin-rong-wang-guo-de-zi-you-zhi-lu-en', 'https://weread.qq.com/web/bookDetail/2cf325a0811e1ea9fg0142b5'],
  ['ji-jing-de-chun-tian-guomai', 'https://weread.qq.com/web/bookDetail/749325905e1935749f8f3dd'],
  ['ji-jing-de-chun-tian-cn', 'https://weread.qq.com/web/bookDetail/5d732430715b9fdf5d75eb6'],
  ['she-ji-xin-li-xue-1', 'https://weread.qq.com/web/bookDetail/7d1327605cb9857d18702ad'],
  ['mang-dian-alt', 'https://weread.qq.com/web/bookDetail/f35329e0811e6b021g019e23'],
  ['ding-wei', 'https://weread.qq.com/web/bookDetail/541324705adc9a5414af73f'],
  ['zao-sheng', 'https://weread.qq.com/web/bookDetail/d33327e0726c18a9d335459'],
  ['duan-she-li-classic', 'https://weread.qq.com/web/bookDetail/03c32ff0813ab8fcdg01192c'],
  ['jin-ri-jian-shi', 'https://weread.qq.com/web/bookDetail/63432820715e8aee634792d'],
  ['wei-xi-guan', 'https://weread.qq.com/web/bookDetail/495326205de23a49561a05d'],
  ['guai-dan-xing-wei-xue', 'https://weread.qq.com/web/bookDetail/6a032ae05e12656a076e414'],
  ['wen-xue-li-lun-ru-men', 'https://weread.qq.com/web/bookDetail/d66326105ceaacd66de76db'],
  ['qiong-cha-li-bao-dian', 'https://weread.qq.com/web/bookDetail/2e0320e05cc92c2e0796c5a'],
  ['rang-chuang-yi-geng-you-nian-xing', 'https://weread.qq.com/web/bookDetail/65632e90716aecd5656b7e1'],
  ['ying-xiao-guan-li-full', 'https://weread.qq.com/web/bookDetail/037322b0811e7dc65g017493'],
  ['mei-de-li-cheng', 'https://weread.qq.com/web/bookDetail/da732820811e7a920g014586'],
  ['ni-ge-ma-ke-lun-li-xue', 'https://weread.qq.com/web/bookDetail/4fb32310811e3d51dg010fa3'],
  ['ling-shou-de-ben-zhi', 'https://weread.qq.com/web/bookDetail/fb032a50718129a2fb0f9af'],
  ['zu-zhi-xing-wei-xue', 'https://weread.qq.com/web/bookDetail/80532d20811e4e83fg0188a7'],
  ['jing-yi-si-wei', 'https://weread.qq.com/web/bookDetail/2c9327b0811e23d4bg017715'],
  ['zi-zi-zhu-ji', 'https://weread.qq.com/web/bookDetail/5fe32330811e1a7ccg018e38']
];

const decode = value => String(value || '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function detail(html, url) {
  const text = decode(html);
  const title = decode(html.match(/<h2[^>]*class="[^"]*wr_bookCover_title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s*-\s*微信读书\s*$/i,'');
  const author = decode(html.match(/<(?:a|p)[^>]*class="[^"]*wr_bookCover_author[^"]*"[^>]*>([\s\S]*?)<\/(?:a|p)>/i)?.[1] || '');
  const publisher = text.match(/出版社\s*([^\s]{2,50})/)?.[1] || '';
  const publishTime = text.match(/出版时间\s*(\d{4}年(?:\d{1,2}月)?)/)?.[1] || '';
  const charCount = text.match(/字数\s*([\d,.]+(?:\s*[万千])?)/)?.[1] || '';
  const hasShelf = text.includes('加入书架');
  const hasRead = /开始阅读|立即阅读|免费阅读/.test(text);
  const unavailableHint = /已下架|暂无版权|版权到期|暂不支持阅读|无法阅读|暂不可读/.test(text);
  const toc = [...html.matchAll(/<li[^>]*class="[^"]*readerCatalog_list_item[^"]*"[^>]*>[\s\S]*?<[^>]+>([\s\S]*?)<\//gi)]
    .map(match => decode(match[1])).filter(Boolean).slice(0, 80);
  return { url, title, author, publisher, publishTime, charCount, hasShelf, hasRead, unavailableHint, available: hasShelf && hasRead && !unavailableHint, toc };
}

const rows = [];
for (const [slug, url] of candidates) {
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
        'accept-language': 'zh-CN,zh;q=0.9'
      }
    });
    const html = await response.text();
    rows.push({ slug, status: response.status, ...detail(html, url) });
  } catch (error) {
    rows.push({ slug, url, error: String(error?.message || error) });
  }
  await new Promise(resolve => setTimeout(resolve, 150));
}
fs.writeFileSync('weread-candidate-details.json', `${JSON.stringify(rows, null, 2)}\n`);
console.log(JSON.stringify(rows.map(({slug,title,author,publisher,publishTime,charCount,available,error}) => ({slug,title,author,publisher,publishTime,charCount,available,error})), null, 2));
