'use client';

interface BookLayoutProps {
  children: React.ReactNode;
  onTocToggle: () => void;
}

export default function BookLayout({ children, onTocToggle }: BookLayoutProps) {
  return (
    <>
      {/* TOC toggle FAB — bottom adjusted to clear mobile bottom nav */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 lg:hidden z-40">
        <button
          onClick={onTocToggle}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-brand/50 flex items-center justify-center group"
          aria-label="打开目录"
        >
          <svg
            className="w-5 h-5 text-slate-700 group-hover:text-brand transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>
      </div>
      {children}
    </>
  );
}
