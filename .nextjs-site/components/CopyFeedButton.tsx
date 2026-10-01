'use client';

import { useState } from 'react';

interface CopyFeedButtonProps {
  value: string;
}

export default function CopyFeedButton({ value }: CopyFeedButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt('复制这个地址：', value);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-outline-brand inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm"
      aria-live="polite"
    >
      {copied ? '已复制' : '复制地址'}
    </button>
  );
}
