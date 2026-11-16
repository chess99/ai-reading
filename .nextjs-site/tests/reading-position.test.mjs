import assert from 'node:assert/strict';
import { test } from 'node:test';
import { captureReadingPosition, restoreReadingPosition } from '../lib/reading-position.ts';

function reader() {
  const items = [
    { text: '章标题', tag: 'H2', y: 100, height: 50 },
    { text: '先前的段落', tag: 'P', y: 300, height: 150 },
    { text: '当前正在阅读的段落', tag: 'P', y: 500, height: 200 },
  ];
  const main = {
    clientHeight: 800, scrollTop: 512,
    getBoundingClientRect: () => ({ top: 60 }),
    scrollTo: ({ top }) => { main.scrollTop = top; },
    querySelectorAll: () => items.map(item => ({
      tagName: item.tag, textContent: item.text, querySelector: () => null,
      getBoundingClientRect: () => ({ top: 60 + item.y - main.scrollTop, bottom: 60 + item.y - main.scrollTop + item.height, height: item.height }),
    })),
  };
  return { items, main };
}

test('reflow preserves the same paragraph and relative point instead of an obsolete pixel offset', () => {
  const { main, items } = reader();
  const position = captureReadingPosition(main);
  assert.equal(position.text, '当前正在阅读的段落');
  assert.equal(position.ratio, 0.3);
  items[1].y = 180;
  items[1].height = 100;
  items[2].y = 320;
  items[2].height = 100;
  main.clientHeight = 390;
  restoreReadingPosition(main, position);
  assert.equal(main.scrollTop, 302);
  assert.equal(captureReadingPosition(main).text, position.text);
  assert.equal(captureReadingPosition(main).ratio, position.ratio);
});

test('inserting earlier paragraphs does not change the target; removing it falls back to its heading', () => {
  const { main, items } = reader();
  const position = captureReadingPosition(main);
  items.unshift({ text: '新增内容', tag: 'P', y: 0, height: 50 });
  items[3].y += 70;
  restoreReadingPosition(main, position);
  assert.equal(main.scrollTop, 582);
  items.pop();
  restoreReadingPosition(main, position);
  assert.equal(main.scrollTop, 52);
});

test('pages without reading blocks retain their ordinary scroll position', () => {
  const { main, items } = reader();
  items.length = 0;
  const position = captureReadingPosition(main);
  main.scrollTop = 0;
  restoreReadingPosition(main, position);
  assert.equal(main.scrollTop, 512);
});

test('repeated chapter labels fall back to the nearby chapter rather than the first matching label', () => {
  const { main, items } = reader();
  items[1] = { text: '章标题', tag: 'H2', y: 300, height: 50 };
  const position = captureReadingPosition(main);
  items[2].text = '这一段已经改写';
  restoreReadingPosition(main, position);
  assert.equal(main.scrollTop, 252);
});
