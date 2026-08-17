'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { CloseIcon, MessageIcon } from '@/components/Icons';
import { trackEvent } from '@/lib/analytics';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const feedbackIssueUrl =
  'https://github.com/chess99/ai-reading/issues/new?' +
  new URLSearchParams({
    title: '反馈：',
    body: [
      '## 反馈类型',
      '<!-- Bug / 体验建议 / 内容问题 / 其他 -->',
      '',
      '## 具体描述',
      '',
      '## 相关页面',
      '<!-- 如果方便，请粘贴出现问题的页面链接 -->',
      '',
      '## 设备与浏览器',
      '<!-- 例如：iPhone Safari / Windows Chrome -->',
    ].join('\n'),
  }).toString();

export default function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  useEffect(() => {
    if (isOpen) trackEvent('反馈与交流', '打开入口');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="关闭反馈与交流"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        className="surface-floating relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl animate-slide-up"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-200/90 bg-[#fffdf8]/95 px-5 py-4 backdrop-blur md:px-6">
          <div>
            <p className="mb-1 text-[10px] font-black tracking-[0.17em] text-brand">FEEDBACK · COMMUNITY</p>
            <h2 id="feedback-dialog-title" className="text-xl font-black text-stone-950 md:text-2xl">
              反馈与交流
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-950"
            aria-label="关闭"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="space-y-5 p-5 md:p-6">
          <section className="brand-soft-panel overflow-hidden rounded-xl border p-5">
            <div className="relative z-[1] grid items-center gap-5 sm:grid-cols-[190px_minmax(0,1fr)]">
              <div className="mx-auto rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
                <Image
                  src="/wechat-qr.jpg"
                  alt="极客小屋微信公众号二维码"
                  width={420}
                  height={420}
                  className="h-40 w-40 sm:h-[174px] sm:w-[174px]"
                  priority
                />
              </div>
              <div className="text-center sm:text-left">
                <span className="icon-tile mb-3 h-9 w-9">
                  <MessageIcon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-black text-stone-950">加入读者交流群</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  交流阅读体会、推荐书目，也欢迎一起改进晨笙阅读。
                </p>
                <p className="mt-3 rounded-lg bg-white/80 px-3 py-2.5 text-sm leading-6 text-stone-700">
                  微信扫码关注公众号「极客小屋」，回复
                  <strong className="mx-1 font-black text-brand">晨笙阅读</strong>
                  获取最新群二维码。
                </p>
                <p className="mt-2 text-xs leading-5 text-stone-500">手机端可长按二维码识别，或保存后在微信中扫码。</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="quick-feedback-title">
            <div className="mb-3">
              <h3 id="quick-feedback-title" className="font-black text-stone-950">快速反馈</h3>
              <p className="mt-1 text-sm leading-6 text-stone-600">不想加群也没关系，可以直接荐书或提交问题。</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/request-book"
                prefetch={false}
                onClick={() => {
                  trackEvent('反馈与交流', '申请加入书库');
                  onClose();
                }}
                className="btn-outline-brand inline-flex items-center justify-center bg-stone-950 text-[#fffdf8] hover:bg-stone-800 hover:text-[#fffdf8]"
              >
                推荐一本书
              </Link>
              <a
                href={feedbackIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('反馈与交流', '提交问题反馈')}
                className="btn-outline-brand inline-flex items-center justify-center"
              >
                提交问题反馈
              </a>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
