'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { useAuth } from '@/features/auth/useAuth';

export default function Header() {
  const { isAuthenticated, signOut, isLoading } = useAuth();
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
                Sign In
              </Button>
              <Button variant="outline" disabled>
                <Spinner data-icon="inline-start" />
                Sign Up
              </Button>
            </>
          )}
          {!isLoading &&
            (isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history">History</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button variant="ghost" size="sm">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            ))}

          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
