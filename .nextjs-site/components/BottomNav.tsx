'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, LibraryIcon, MessageIcon, SettingsIcon, TopicIcon } from '@/components/Icons';

const tabs = [
  {
    href: '/',
    label: '首页',
    icon: HomeIcon,
  },
  {
    href: '/topics',
    label: '主题',
    icon: TopicIcon,
  },
  {
    href: '/library',
    label: '书库',
    icon: LibraryIcon,
  },
  {
    action: 'feedback',
    label: '交流',
    icon: MessageIcon,
  },
  {
    href: '/settings',
    label: '设置',
    icon: SettingsIcon,
  },
] as const;

interface BottomNavProps {
  onFeedbackClick: () => void;
}

export default function BottomNav({ onFeedbackClick }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf8]/92 backdrop-blur-xl border-t border-stone-200/90 shadow-[0_-18px_40px_-30px_rgba(79,58,35,0.8)]">
      <div className="grid grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => {
          const Icon = tab.icon;

          if ('action' in tab) {
            return (
              <button
                key={tab.action}
                type="button"
                onClick={onFeedbackClick}
                className="flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg py-2 text-stone-400 transition-all hover:bg-stone-100 active:scale-95 active:bg-stone-100"
                aria-label="反馈与交流"
              >
                <span className="grid h-7 w-8 place-items-center rounded-md">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold leading-none text-stone-500">{tab.label}</span>
              </button>
            );
          }

          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              prefetch={false}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-2 gap-1 min-h-[58px] rounded-lg transition-all active:scale-95 ${
                active ? 'text-stone-950' : 'text-stone-400 hover:bg-stone-100 active:bg-stone-100'
              }`}
            >
              <span className={`grid place-items-center w-8 h-7 rounded-md transition-colors ${active ? 'bg-brand/12 text-brand' : ''}`}>
                <Icon className="w-5 h-5" />
              </span>
              <span className={`text-[11px] font-semibold leading-none ${active ? 'text-brand' : 'text-stone-500'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
