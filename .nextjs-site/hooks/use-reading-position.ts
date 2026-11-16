'use client';

import { useLayoutEffect, type RefObject } from 'react';
import { captureReadingPosition, restoreReadingPosition, takeReloadPosition } from '@/lib/reading-position';

export function useReadingPosition(mainRef: RefObject<HTMLElement | null>, pathname: string) {
  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const saved = takeReloadPosition(pathname);
    if (saved) {
      main.dataset.readingPositionRestored = 'true';
      restoreReadingPosition(main, saved);
    }
    let anchor = captureReadingPosition(main);
    let width = main.clientWidth;
    let height = main.clientHeight;
    let contentHeight = main.scrollHeight;
    let restoring = false;
    let frame = 0;
    let settleFrame = 0;

    const capture = () => {
      // 重排引发的 scroll 事件可能早于 ResizeObserver，不能用新布局覆盖旧锚点。
      if (restoring || width !== main.clientWidth || height !== main.clientHeight || contentHeight !== main.scrollHeight) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { anchor = captureReadingPosition(main); });
    };
    const observer = new ResizeObserver(() => {
      if (width === main.clientWidth && height === main.clientHeight && contentHeight === main.scrollHeight) return;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
      width = main.clientWidth;
      height = main.clientHeight;
      contentHeight = main.scrollHeight;
      restoring = true;
      restoreReadingPosition(main, anchor);
      settleFrame = requestAnimationFrame(() => {
        restoring = false;
        anchor = captureReadingPosition(main);
      });
    });
    observer.observe(main);
    if (main.firstElementChild) observer.observe(main.firstElementChild);
    main.addEventListener('scroll', capture, { passive: true });
    return () => {
      delete main.dataset.readingPositionRestored;
      observer.disconnect();
      main.removeEventListener('scroll', capture);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
    };
  }, [mainRef, pathname]);
}
