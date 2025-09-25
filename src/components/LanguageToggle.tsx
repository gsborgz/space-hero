'use client'

import { Languages } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentLanguage(i18nInstance.language || 'pt');

    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18nInstance.on('languageChanged', handleLanguageChange);

    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

  const languages = [
    { code: 'pt', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
  ];

  const handleLanguageChange = (langCode: string) => {
    if (i18nInstance && typeof i18nInstance.changeLanguage === 'function') {
      i18nInstance.changeLanguage(langCode);
    } else {
      console.error('i18n.changeLanguage is not available');
    }
  };

  if (!isClient) {
    return (
      <Button variant='ghost' size='icon' title="Toggle language">
        <Languages className='h-4 w-4 text-gray-950 dark:text-gray-50' />
        <span className='sr-only'>Toggle language</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' title={t('toggleLanguage')}>
          <Languages className='h-4 w-4 text-gray-950 dark:text-gray-50' />
          <span className='sr-only'>Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? 'bg-gray-200 dark:bg-zinc-700' : ''}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
