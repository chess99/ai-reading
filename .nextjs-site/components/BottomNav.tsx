'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, LibraryIcon, SettingsIcon, TopicIcon } from '@/components/Icons';

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
    href: '/settings',
    label: '设置',
    icon: SettingsIcon,
  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-stone-200/90 bg-(--color-surface) pl-[max(.5rem,env(safe-area-inset-left))] pr-[max(.5rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {tabs.map(tab => {
        const active = isActive(tab.href);
        const Icon = tab.icon;
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
    </nav>
  );
}
