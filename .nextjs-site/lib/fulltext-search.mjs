export const FULLTEXT_PAGE_SIZE = 10;

// Merge lazy result handles before fetching excerpts, so phrase ranking never
// requires downloading every matching document.
export async function searchFulltext(pagefind, keyword) {
  const query = keyword.trim();
  if (!query) return [];
  if (query.includes('"')) {
    const results = (await pagefind.search(query)).results;
    results.forEach(result => { result.phraseMatch = /^".+"$/.test(query); });
    return results;
  }

  const [phrase, words] = await Promise.all([
    pagefind.search(`"${query}"`),
    pagefind.search(query),
  ]);
  const ordered = new Map();
  for (const [results, phraseMatch] of [[phrase.results, true], [words.results, false]]) {
    for (const result of results) {
      if (!ordered.has(result.id)) {
        // Pagefind ties worker data callbacks to these exact objects through
        // FinalizationRegistry. Cloning a handle frees its callback too early.
        result.phraseMatch = phraseMatch;
        ordered.set(result.id, result);
      }
    }
  }
  return [...ordered.values()];
}

function plainExcerpt(excerpt = '') {
  return excerpt.replace(/<\/?mark>/g, '').toLocaleLowerCase();
}

function formatResult(result, data, keyword) {
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
}

function abortError(signal) {
  return signal?.reason ?? new DOMException('Search cancelled', 'AbortError');
}

function readWithTimeout(read, signal, timeoutMs) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(abortError(signal)); return; }
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      callback(value);
    };
    const onAbort = () => finish(reject, abortError(signal));
    const timer = setTimeout(() => finish(reject, new Error('Search result timed out')), timeoutMs);
    signal?.addEventListener('abort', onAbort, { once: true });
    Promise.resolve().then(read).then(value => finish(resolve, value), error => finish(reject, error));
  });
}

// A cursor counts attempted handles, not successful downloads. Failed slots
// retain their rank and can be retried without duplicating or skipping results.
export async function loadFulltextBatch(results, keyword, offset = 0, options = {}) {
  const { signal, onSettled, concurrency = 3, retries = 1, retryDelayMs = 250, timeoutMs = 8000 } = options;
  const selected = results.slice(offset, offset + FULLTEXT_PAGE_SIZE);
  const entries = new Array(selected.length);
  let next = 0;
  const worker = async () => {
    while (next < selected.length && !signal?.aborted) {
      const index = next++;
      const result = selected[index];
      const identity = { id: result.id, phraseMatch: result.phraseMatch ?? false };
      let entry;
      try {
        let data;
        for (let attempt = 0; ; attempt++) {
          try {
            data = await readWithTimeout(() => result.data(), signal, timeoutMs);
            break;
          } catch (error) {
            if (signal?.aborted || attempt >= retries) throw error;
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
            if (signal?.aborted) throw abortError(signal);
          }
        }
        entry = { ...identity, status: 'ready', item: formatResult(result, data, keyword) };
      } catch (error) {
        if (signal?.aborted) throw abortError(signal);
        entry = { ...identity, status: 'error', error };
      }
      if (signal?.aborted) throw abortError(signal);
      entries[index] = entry;
      onSettled?.(entry);
    }
  };
  await Promise.all(Array.from({ length: Math.min(Math.max(1, concurrency), selected.length) }, worker));
  if (signal?.aborted) throw abortError(signal);
  return { entries, nextOffset: Math.min(results.length, offset + selected.length) };
}
