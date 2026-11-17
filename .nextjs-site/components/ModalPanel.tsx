'use client';

import { useEffect, useId, useRef } from 'react';
import { CloseIcon } from '@/components/Icons';

interface ModalPanelProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placement?: 'left' | 'right' | 'center';
  children: React.ReactNode;
}

export default function ModalPanel({ id, isOpen, onClose, title, placement = 'right', children }: ModalPanelProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const main = document.querySelector<HTMLElement>('main.overflow-auto');
    const overflow = main?.style.overflow ?? '';
    if (main) main.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      if (main) main.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-labelledby={titleId}
      className="app-dialog"
      data-placement={placement}
      onCancel={event => { event.preventDefault(); closeRef.current(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeRef.current();
      }}
    >
      {isOpen && <div className="dialog-shell">
        <header className="dialog-heading">
          <h2 id={titleId} className="text-lg font-black text-stone-950">{title}</h2>
          <button onClick={() => closeRef.current()} className="touch-icon hover:bg-stone-100" aria-label={`关闭${title}`}>
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <div className="dialog-content">{children}</div>
      </div>}
    </dialog>
  );
}
