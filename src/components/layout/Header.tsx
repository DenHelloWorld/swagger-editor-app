'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { useAuth } from '@/features/auth/useAuth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { History, Info, LogIn, LogOut, Menu, UserPlus } from 'lucide-react';
import { useScrollStore } from '@/store/scrollStore';
import { useActivePath } from '@/hooks/useActivePath';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut, isLoading } = useAuth();
  const { t } = useTranslation();
  const isScrolled = useScrollStore((s) => s.isScrolled);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = useActivePath();

  async function handleSignOut() {
    const error = await signOut();
    if (error) {
      toast.error(t(error));
      return;
    }
    if (pathname.startsWith('/history')) {
      router.replace('/');
    }
    setIsMenuOpen(false);
  }

  function renderNavItems(onNavigate?: () => void, mobile = false) {
    const size = mobile ? 'lg' : 'sm';
    const itemClassName = mobile ? 'h-12 w-full justify-start text-base' : '';

    function linkClassName(active: boolean) {
      return active ? styles['header__nav_link--active'] : '';
    }

    return (
      <>
        {isLoading && (
          <>
            <Button
              variant="outline"
              size={size}
              className={itemClassName}
              disabled
            >
              <Spinner data-icon="inline-start" />
              {t('header.signIn')}
            </Button>
            <Button
              variant="outline"
              size={size}
              className={itemClassName}
              disabled
            >
              <Spinner data-icon="inline-start" />
              {t('header.signUp')}
            </Button>
          </>
        )}
        {!isLoading &&
          (isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size={size}
                className={itemClassName}
                asChild
              >
                <Link
                  href="/history"
                  onClick={onNavigate}
                  aria-current={isActive('/history') ? 'page' : undefined}
                  className={linkClassName(isActive('/history'))}
                >
                  <History data-icon="inline-start" />
                  {t('header.history')}
                </Link>
              </Button>
              <Button
                variant="outline"
                size={size}
                className={itemClassName}
                onClick={handleSignOut}
              >
                <LogOut data-icon="inline-start" />
                {t('header.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size={size}
                className={itemClassName}
                asChild
              >
                <Link href="/sign-in" onClick={onNavigate}>
                  <LogIn data-icon="inline-start" />
                  {t('header.signIn')}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size={size}
                className={itemClassName}
                asChild
              >
                <Link href="/sign-up" onClick={onNavigate}>
                  <UserPlus data-icon="inline-start" />
                  {t('header.signUp')}
                </Link>
              </Button>
            </>
          ))}

        <Button variant="ghost" size={size} className={itemClassName} asChild>
          <Link
            href="/about"
            onClick={onNavigate}
            aria-current={isActive('/about') ? 'page' : undefined}
            className={linkClassName(isActive('/about'))}
          >
            <Info data-icon="inline-start" />
            {t('header.about')}
          </Link>
        </Button>
        <LanguageToggle size={size} />
      </>
    );
  }

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles['header--scrolled'] : ''}`}
    >
      <div className={styles.header__bar}>
        <Link
          href="/"
          className={styles.header__logo}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          <Image
            src="/logo.png"
            alt="App logo"
            width={48}
            height={48}
            className={`${styles.header__logo_image} ${isActive('/') ? styles['header__logo_image--active'] : ''}`}
            priority
          />
        </Link>

        <div className={styles.header__nav}>{renderNavItems()}</div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={styles.header__menu_trigger}
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t('header.menu')}</SheetTitle>
            </SheetHeader>
            <div className={styles.header__mobile_nav}>
              {renderNavItems(() => setIsMenuOpen(false), true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
