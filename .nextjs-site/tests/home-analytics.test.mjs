import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const analyticsSource = readFileSync(new URL('../lib/analytics.ts', import.meta.url), 'utf8');
const trackerSource = readFileSync(new URL('../components/HomeModuleAnalytics.tsx', import.meta.url), 'utf8');
const homeSource = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const searchSource = readFileSync(new URL('../components/SearchBar.tsx', import.meta.url), 'utf8');

test('analytics supports named events with structured home parameters', () => {
  assert.match(analyticsSource, /trackAnalyticsEvent/);
  assert.match(analyticsSource, /home_module_impression/);
  assert.match(analyticsSource, /home_module_click/);
  assert.match(analyticsSource, /has_reading_history/);
  assert.match(analyticsSource, /item_slug/);
});

test('home tracker records one delayed viewport impression and delegated clicks', () => {
  assert.match(trackerSource, /IntersectionObserver/);
  assert.match(trackerSource, /setTimeout\(trackImpression, 600\)/);
  assert.match(trackerSource, /intersectionRatio >= 0\.25/);
  assert.match(trackerSource, /threshold: \[0\.25\]/);
  assert.match(trackerSource, /onClickCapture/);
  assert.match(trackerSource, /getReadingHistory/);
});

test('home wraps every decision module in analytics boundaries', () => {
  for (const module of ['continue', 'intro', 'search', 'latest']) {
    assert.match(homeSource, new RegExp(`module="${module}"`));
  }
  assert.match(homeSource, /<HomeIntro \/>/);
});

test('random navigation records the selected book directly', () => {
  assert.match(searchSource, /useHomeModuleImpression<HTMLButtonElement>\('random'\)/);
  assert.match(searchSource, /trackHomeModuleClick\('random'/);
  assert.match(searchSource, /itemSlug: randomBook\.slug/);
  assert.match(searchSource, /data-home-analytics-direct="true"/);
});
