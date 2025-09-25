'use client'

import ThemeToggle from '@components/ThemeToggle';
import { LanguageToggle } from '@components/LanguageToggle';

export default function Header() {
  return (
    <HeaderBar>
      <div className='flex flex-1 items-center justify-end gap-2 px-4 py-3'>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </HeaderBar>
  );
}

function HeaderBar({ children }: { children: React.ReactNode }) {
  return (
    <header className='h-[6%] sticky flex items-center justify-between top-0 z-50 w-full !p-0 sm:px-4 border-b backdrop-blur border-slate-400'>
      {children}
    </header>
  );
}
