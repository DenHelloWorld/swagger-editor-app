'use client';

import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setCookie } from '@/lib/cookies';
import { isHistoryPath } from '@/i18n/locale';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const current = i18n.language.split('-')[0];

  function handleSelect(code: string) {
    i18n.changeLanguage(code);
    setCookie('app_language', code);

    if (pathname && isHistoryPath(pathname)) {
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Languages data-icon="inline-start" />
          {current.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleSelect(code)}
            disabled={code === current}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
