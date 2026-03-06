'use client';

interface BookLayoutProps {
  children: React.ReactNode;
  onTocToggle: () => void;
  shareTitle?: string;
}

export default function BookLayout({ children, onTocToggle, shareTitle }: BookLayoutProps) {
  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: shareTitle,
        url: window.location.href,
      });
    } catch {
      // 用户取消分享，忽略
    }
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      {/* 右下角悬浮按钮组 */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40 flex flex-col gap-3">
        {/* 分享按钮 */}
        {canShare && (
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-[#667eea]/50 flex items-center justify-center group"
            aria-label="分享"
          >
            <svg
              className="w-5 h-5 text-slate-700 group-hover:text-[#667eea] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        )}

        {/* TOC Toggle Button */}
        <button
          onClick={onTocToggle}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-[#667eea]/50 flex items-center justify-center group"
          aria-label="打开目录"
        >
          <svg
            className="w-5 h-5 text-slate-700 group-hover:text-[#667eea] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>
      </div>

      {children}
    </>
  );
}
