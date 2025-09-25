'use client'

import { Moon, Sun } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sun = <Sun className='h-4 w-4 text-gray-950 dark:text-gray-50' />;
  const moon = <Moon className='h-4 w-4 text-gray-950 dark:text-gray-50' />;

  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    const stored = localStorage.getItem('theme');

    if (stored === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const isDarkMode = root.classList.contains('dark');

    if (isDarkMode) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant='ghost'
        size='icon'
        aria-label='Change Theme'
        disabled
      >
        <Sun className='h-4 w-4 text-gray-950 dark:text-gray-50' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Change Theme'
      onClick={toggleTheme}
    >
      {isDark ? moon : sun}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
