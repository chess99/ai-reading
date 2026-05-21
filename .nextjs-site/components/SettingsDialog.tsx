'use client';

import SettingsContent from '@/components/SettingsContent';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allBooks: { slug: string; title: string; author: string }[];
}

export default function SettingsDialog({ isOpen, onClose, allBooks }: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-stone-950/45 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 对话框 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="surface-card max-w-lg w-full max-h-[80vh] overflow-y-auto pointer-events-auto animate-slide-up"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#fffdf8] border-b border-stone-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-stone-950">设置</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <svg
                className="w-5 h-5 text-stone-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <SettingsContent allBooks={allBooks} />
          </div>
        </div>
      </div>
    </>
  );
}
