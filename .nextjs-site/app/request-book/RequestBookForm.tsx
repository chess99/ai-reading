'use client';

import { useEffect, useRef } from 'react';

const FORM_SCRIPT_SRC =
  'https://7hedbe0u.jsjform.com/f/meECjh/embedded.js?background=transparent&banner=hide&inner_redirect=false&height=1060';

export default function RequestBookForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = FORM_SCRIPT_SRC;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[1060px] overflow-hidden bg-[#fffdf8] md:rounded-lg md:border md:border-stone-200/80 md:shadow-[0_20px_48px_-34px_rgba(79,58,35,0.5)]"
    />
  );
}
