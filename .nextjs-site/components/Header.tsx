'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Menu button for mobile */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          )}

          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity"
            style={{
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI 阅读
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="text-sm md:text-base text-gray-700 font-medium transition-colors hover:text-[#667eea]"
            >
              首页
            </Link>
            <a
              href="https://cearl.cc/BookDistill/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm md:text-base text-gray-700 font-medium transition-colors hover:text-[#667eea]"
            >
              <span>BookDistill</span>
              <svg
                className="w-3 h-3 opacity-60"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 12 12"
                stroke="currentColor"
              >
                <path d="M10.5 1.5L1.5 10.5M10.5 1.5H4.5M10.5 1.5V7.5" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
