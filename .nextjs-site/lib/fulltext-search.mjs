export const FULLTEXT_PAGE_SIZE = 10;

// Merge lazy result handles before fetching excerpts, so phrase ranking never
// requires downloading every matching document.
export async function searchFulltext(pagefind, keyword) {
  const query = keyword.trim();
  if (!query) return [];
  if (query.includes('"')) {
    return (await pagefind.search(query)).results.map(result => ({ ...result, phraseMatch: /^".+"$/.test(query) }));
  }

  const [phrase, words] = await Promise.all([
    pagefind.search(`"${query}"`),
    pagefind.search(query),
  ]);
  const ordered = new Map();
  for (const [results, phraseMatch] of [[phrase.results, true], [words.results, false]]) {
    for (const result of results) {
      if (!ordered.has(result.id)) ordered.set(result.id, { ...result, phraseMatch });
    }
  }
  return [...ordered.values()];
}

function plainExcerpt(excerpt = '') {
  return excerpt.replace(/<\/?mark>/g, '').toLocaleLowerCase();
}

export async function loadFulltextPage(results, keyword, offset = 0) {
  return Promise.all(results.slice(offset, offset + FULLTEXT_PAGE_SIZE).map(async result => {
    const data = await result.data();
    const query = keyword.trim().replace(/^"|"$/g, '');
    const sections = (data.sub_results ?? []).filter(section => section.url.includes('#'));
    // Prefer a section whose excerpt contains the entire query, then the one
    // with the most matching terms. Stable sorting retains document order.
    sections.sort((a, b) =>
      Number(plainExcerpt(b.excerpt).includes(query.toLocaleLowerCase())) -
        Number(plainExcerpt(a.excerpt).includes(query.toLocaleLowerCase())) ||
      (b.locations?.length ?? 0) - (a.locations?.length ?? 0));
    const section = sections[0];
    const url = new URL(section?.url ?? data.url, 'https://search.local');
    url.searchParams.set('highlight', query);
    return {
      id: result.id,
      phraseMatch: result.phraseMatch ?? false,
      url: `${url.pathname}${url.search}${url.hash}`,
      title: data.meta?.title ?? '未命名内容',
      section: section?.title ?? '',
      excerptHtml: section?.excerpt ?? data.excerpt ?? '',
    };
  }));
}
