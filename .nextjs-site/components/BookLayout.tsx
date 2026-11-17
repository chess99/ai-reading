'use client';

interface BookLayoutProps {
  children: React.ReactNode;
  onTocToggle: () => void;
  isTocOpen: boolean;
}

export default function BookLayout({ children, onTocToggle, isTocOpen }: BookLayoutProps) {
  return (
    <>
      <div className="reader-toc-trigger">
        <button
          onClick={onTocToggle}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-[#fffdf8] px-4 font-semibold text-stone-800 shadow-lg hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="打开目录"
          aria-expanded={isTocOpen}
          aria-controls="book-toc-drawer"
        >
          <svg
            className="w-5 h-5 text-stone-700 group-hover:text-brand transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          <span>目录</span>
        </button>
      </div>
      {children}
    </>
  );
}
