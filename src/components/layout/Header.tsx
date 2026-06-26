import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Header() {
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
          <Button>Sign In</Button>
          <Button>Sign Up</Button>
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
