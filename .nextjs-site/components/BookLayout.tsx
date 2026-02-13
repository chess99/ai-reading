'use client';

interface BookLayoutProps {
  children: React.ReactNode;
  onTocToggle: () => void;
}

export default function BookLayout({ children, onTocToggle }: BookLayoutProps) {
  return (
    <>
      {/* TOC Toggle Button - 右下角悬浮按钮 */}
      <button
        onClick={onTocToggle}
        className="fixed bottom-6 right-6 lg:hidden z-40 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-[#667eea]/50 flex items-center justify-center group"
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

      {children}
    </>
  );
}
