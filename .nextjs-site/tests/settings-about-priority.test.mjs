import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('settings page groups about as site information after feedback utilities', () => {
  const settingsSource = readFileSync(new URL('../components/SettingsContent.tsx', import.meta.url), 'utf8');
  const siteInfoIndex = settingsSource.indexOf('站点信息');
  const aboutIndex = settingsSource.indexOf('href="/about"');
  const offlineIndex = settingsSource.indexOf('离线模式');
  const storageIndex = settingsSource.indexOf('存储管理');
  const feedbackIndex = settingsSource.indexOf('反馈与补充');

  assert.notEqual(siteInfoIndex, -1, 'Settings should include a site information group.');
  assert.notEqual(aboutIndex, -1, 'Settings should expose an about entry.');
  assert.notEqual(offlineIndex, -1, 'Settings should keep offline controls.');
  assert.notEqual(storageIndex, -1, 'Settings should keep storage controls.');
  assert.notEqual(feedbackIndex, -1, 'Settings should keep feedback controls.');
  assert.ok(offlineIndex < storageIndex, 'Offline controls should appear before storage management.');
  assert.ok(storageIndex < feedbackIndex, 'Feedback should follow utility settings.');
  assert.ok(feedbackIndex < siteInfoIndex, 'Site information should be the final group.');
  assert.ok(siteInfoIndex < aboutIndex, 'About should live inside site information.');
  assert.doesNotMatch(settingsSource, /了解整理方式/, 'Settings should not oversell the about entry.');
});
