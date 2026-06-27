import Link from 'next/link';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-t backdrop-blur">
      <div className="flex h-16 items-center justify-center gap-10">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/about">About</Link>
        </Button>
        <p className="text-sm font-medium">© 2026 Swagger Editor</p>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            RS School
          </a>
        </Button>
      </div>
    </footer>
  );
}
