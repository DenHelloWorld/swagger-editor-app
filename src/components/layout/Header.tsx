'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { useAuth } from '@/features/auth/useAuth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { History, Info, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useScrollStore } from '@/store/scrollStore';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut, isLoading } = useAuth();
  const { t } = useTranslation();
  const isScrolled = useScrollStore((s) => s.isScrolled);
  const setScrolled = useScrollStore((s) => s.setScrolled);

  useEffect(() => {
    function handleScroll(event: Event) {
      const target = event.target;
      const scrollTop =
        target instanceof HTMLElement
          ? target.scrollTop
          : document.documentElement.scrollTop;
      setScrolled(scrollTop > 0);
    }

    setScrolled((document.querySelector('main')?.scrollTop ?? 0) > 0);

    document.addEventListener('scroll', handleScroll, true);
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, [setScrolled]);

  async function handleSignOut() {
    const error = await signOut();
    if (error) {
      toast.error(error);
      return;
    }
    if (pathname.startsWith('/history')) {
      router.replace('/');
    }
  }

  return (
    <header
      className={cn(
        'bg-background/90 w-full border-b backdrop-blur transition-all duration-200',
        isScrolled ? 'shadow-sm' : 'shadow-none',
      )}
    >
      <div
        className={cn(
          'mx-4 flex items-center justify-between transition-all duration-200',
          isScrolled ? 'h-12' : 'h-16',
        )}
      >
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold"
        >
          <Image
            src="/logo.png"
            alt="App logo"
            width={48}
            height={48}
            className="rounded-lg"
            priority
          />
        </Link>

        <div className="flex items-center space-x-4">
          {isLoading && (
            <>
              <Button variant="outline" disabled>
                <Spinner data-icon="inline-start" />
                {t('header.signIn')}
              </Button>
              <Button variant="outline" disabled>
                <Spinner data-icon="inline-start" />
                {t('header.signUp')}
              </Button>
            </>
          )}
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history">
                    <History data-icon="inline-start" />
                    {t('header.history')}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut data-icon="inline-start" />
                  {t('header.signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">
                    <LogIn data-icon="inline-start" />
                    {t('header.signIn')}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-up">
                    <UserPlus data-icon="inline-start" />
                    {t('header.signUp')}
                  </Link>
                </Button>
              </>
            ))}

          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">
              <Info data-icon="inline-start" />
              {t('header.about')}
            </Link>
          </Button>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
