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

type Props = {
  size?: 'sm' | 'lg';
};

export function LanguageToggle({ size = 'sm' }: Props) {
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
        <Button
          variant="ghost"
          size={size}
          className={size === 'lg' ? 'h-12 w-full justify-start text-base' : ''}
        >
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
            className={size === 'lg' ? 'px-3 py-2.5 text-base' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
