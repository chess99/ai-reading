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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf8]/92 backdrop-blur-xl border-t border-stone-200/90 shadow-[0_-18px_40px_-30px_rgba(79,58,35,0.8)]">
      <div className="grid grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
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
