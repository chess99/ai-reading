import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('settings page promotes the about entry before utility settings', () => {
  const settingsSource = readFileSync(new URL('../components/SettingsContent.tsx', import.meta.url), 'utf8');
  const aboutIndex = settingsSource.indexOf('关于晨笙阅读');
  const offlineIndex = settingsSource.indexOf('离线模式');
  const feedbackIndex = settingsSource.indexOf('建议与反馈');

  assert.notEqual(aboutIndex, -1, 'Settings should expose an about entry.');
  assert.notEqual(offlineIndex, -1, 'Settings should keep offline controls.');
  assert.notEqual(feedbackIndex, -1, 'Settings should keep feedback controls.');
  assert.ok(aboutIndex < offlineIndex, 'About should appear before utility settings.');
  assert.ok(aboutIndex < feedbackIndex, 'About should appear before feedback.');
  assert.match(settingsSource, /了解整理方式/, 'About entry should explain why the user should open it.');
});
