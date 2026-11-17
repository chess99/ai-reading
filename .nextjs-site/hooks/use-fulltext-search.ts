'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { devDependencies } from '@/package.json';
import { ReadingEvents } from '@/lib/analytics';
import { FULLTEXT_PAGE_SIZE, loadFulltextBatch, searchFulltext } from '@/lib/fulltext-search.mjs';
import type { FulltextEntry, PagefindModule, PagefindResult } from '@/lib/fulltext-search.mjs';

let pagefindPromise: Promise<PagefindModule> | null = null;
function getPagefind(): Promise<PagefindModule> {
  if (!pagefindPromise) {
    const scriptUrl = `/pagefind/pagefind.js?v=${encodeURIComponent(devDependencies.pagefind)}`;
    pagefindPromise = import(/* webpackIgnore: true */ scriptUrl).then(async imported => {
      const pagefind = (imported.default ?? imported) as PagefindModule;
      try {
        await pagefind.init();
        await pagefind.preload('');
      } catch (error) {
        await pagefind.destroy();
        throw error;
      }
      return pagefind;
    }).catch(error => { pagefindPromise = null; throw error; });
  }
  return pagefindPromise;
}

interface SearchState {
  query: string;
  entries: FulltextEntry[];
  total: number;
  phraseCount: number;
}
interface SearchSession {
  query: string;
  results: PagefindResult[];
  cursor: number;
  failedIds: Set<string>;
  inFlight: boolean;
  signal: AbortSignal;
}

export function useFulltextSearch(query: string, enabled: boolean) {
  const [state, setState] = useState<SearchState>({ query: '', entries: [], total: 0, phraseCount: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retry, setRetry] = useState(0);
  const [automaticLoading, setAutomaticLoading] = useState(false);
  const sessionRef = useRef<SearchSession | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAutomaticLoading(typeof IntersectionObserver !== 'undefined');
    getPagefind().then(() => { if (!cancelled) setIsIndexReady(true); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async (retryFailed = false) => {
    const session = sessionRef.current;
    if (!session || session.signal.aborted || session.inFlight) return;
    if (!retryFailed && session.failedIds.size) return;
    const selected = retryFailed
      ? session.results.filter(result => session.failedIds.has(result.id))
      : session.results.slice(session.cursor, session.cursor + FULLTEXT_PAGE_SIZE);
    if (!selected.length) return;
    session.inFlight = true;
    if (!retryFailed) session.cursor += selected.length;
    const pending: FulltextEntry[] = selected.map(result => ({ id: result.id, phraseMatch: result.phraseMatch ?? false, status: 'loading' }));
    setState(current => ({ ...current, entries: retryFailed
      ? current.entries.map(entry => pending.find(item => item.id === entry.id) ?? entry)
      : [...current.entries, ...pending] }));
    setIsLoadingMore(true);
    const settledIds = new Set<string>();
    try {
      await loadFulltextBatch(selected, session.query, 0, {
        signal: session.signal,
        onSettled: entry => {
          if (sessionRef.current !== session || session.signal.aborted) return;
          settledIds.add(entry.id);
          if (entry.status === 'error') {
            session.failedIds.add(entry.id);
            console.warn('Fulltext result failed', entry.id, entry.error);
          } else session.failedIds.delete(entry.id);
          setState(current => ({ ...current, entries: current.entries.map(item => item.id === entry.id ? entry : item) }));
        },
      });
    } catch (error) {
      if (sessionRef.current === session && !session.signal.aborted) {
        selected.filter(result => !settledIds.has(result.id)).forEach(result => session.failedIds.add(result.id));
        setState(current => ({ ...current, entries: current.entries.map(entry =>
          selected.some(result => result.id === entry.id) && !settledIds.has(entry.id) && entry.status === 'loading'
            ? { id: entry.id, phraseMatch: entry.phraseMatch, status: 'error', error } : entry) }));
      }
    } finally {
      if (sessionRef.current === session && !session.signal.aborted) {
        session.inFlight = false;
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    sessionRef.current = null;
    setIsLoadingMore(false);
    setErrorMessage('');
    if (!enabled || !query) { setIsSearching(false); return; }
    const controller = new AbortController();
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const pagefind = await getPagefind();
        if (controller.signal.aborted) return;
        setIsIndexReady(true);
        const results = await searchFulltext(pagefind, query);
        if (controller.signal.aborted) return;
        sessionRef.current = { query, results, cursor: 0, failedIds: new Set(), inFlight: false, signal: controller.signal };
        setState({ query, entries: [], total: results.length, phraseCount: results.filter(result => result.phraseMatch).length });
        setIsSearching(false);
        await loadMore();
        if (!controller.signal.aborted && results.length) ReadingEvents.trackSearch(query);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn('Fulltext search failed', error);
        setState({ query, entries: [], total: 0, phraseCount: 0 });
        setErrorMessage('搜索暂时不可用，请重试。');
        setIsSearching(false);
      }
    }, 250);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [query, enabled, retry, loadMore]);

  const failedCount = state.entries.filter(entry => entry.status === 'error').length;
  const readyCount = state.entries.filter(entry => entry.status === 'ready').length;
  const hasMore = state.entries.length < state.total;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || state.query !== query || !automaticLoading || !hasMore || isLoadingMore || isSearching || failedCount || !sentinel) return;
    let active = true;
    const observer = new IntersectionObserver(entries => {
      if (active && entries.some(entry => entry.isIntersecting)) void loadMore();
    }, { root: document.querySelector('main.overflow-auto'), rootMargin: '0px 0px 480px 0px' });
    observer.observe(sentinel);
    return () => { active = false; observer.disconnect(); };
  }, [query, enabled, state.query, automaticLoading, hasMore, isLoadingMore, isSearching, failedCount, loadMore]);

  return {
    ...state, isSearching, isLoadingMore, isIndexReady, errorMessage, failedCount, readyCount,
    hasMore, automaticLoading, sentinelRef,
    loadMore: () => loadMore(),
    retryFailed: () => loadMore(true),
    retrySearch: () => setRetry(value => value + 1),
  };
}
