'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { useAuth } from '@/features/auth/useAuth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut, isLoading } = useAuth();
  const { t } = useTranslation();

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
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-b backdrop-blur">
      <div className="mx-4 flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold"
        >
          <Image
            src="/logo.png"
            alt="App logo"
            width={64}
            height={20}
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
                  <Link href="/history">{t('header.history')}</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  {t('header.signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">{t('header.signIn')}</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-up">{t('header.signUp')}</Link>
                </Button>
              </>
            ))}

          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">{t('header.about')}</Link>
          </Button>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
