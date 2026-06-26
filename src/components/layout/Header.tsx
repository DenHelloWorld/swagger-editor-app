'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuth } from '@/features/auth/useAuth';

export default function Header() {
  const { isAuthenticated, signIn, signUp, signOut } = useAuth();
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
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
          {isAuthenticated ? (
            <>
              <Button asChild>
                <Link href="/history">History</Link>
              </Button>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button onClick={() => signIn('example@gmail.com')}>
                Sign In
              </Button>
              <Button onClick={() => signUp('example@gmail.com')}>
                Sign Up
              </Button>
            </>
          )}

          <Link
            href="/about"
            className="hidden text-sm font-medium hover:underline sm:block"
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}
