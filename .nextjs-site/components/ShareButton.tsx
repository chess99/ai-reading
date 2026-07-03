'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { ShareIcon } from '@/components/Icons';

export interface ShareConfig {
  title?: string;
  text?: string;
  url?: string;
  eventAction: string;
  eventLabel?: string;
}

interface ShareButtonProps {
  shareConfig: ShareConfig;
  className?: string;
  iconClassName?: string;
  label?: string;
  showLabel?: boolean;
}

export default function ShareButton({
  shareConfig,
  className = 'p-2 hover:bg-stone-100 rounded-lg transition-colors group active:scale-95',
  iconClassName = 'w-5 h-5 text-stone-700 group-hover:text-brand transition-colors',
  label = '分享',
  showLabel = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const url = shareConfig.url || window.location.href;
    const shareData = {
      title: shareConfig.title,
      text: shareConfig.text,
      url,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
      trackEvent('share', shareConfig.eventAction, shareConfig.eventLabel || shareConfig.title);
    } catch {
      // User cancelled the native share sheet or clipboard was unavailable.
    }
  };

  return (
    <span className="relative inline-flex">
      <button type="button" onClick={handleShare} className={className} aria-label={label} title={label}>
        <ShareIcon className={iconClassName} />
        {showLabel && <span>{label}</span>}
      </button>
      {copied && (
        <span className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-md border border-stone-200 bg-[#fffdf8] px-2.5 py-1.5 text-xs font-semibold text-stone-700 shadow-sm">
          链接已复制
        </span>
      )}
    </span>
  );
}
