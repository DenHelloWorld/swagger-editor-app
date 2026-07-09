import Link from 'next/link';
import { Info, GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="flex h-16 items-center justify-center gap-10">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/about">
            <Info data-icon="inline-start" />
            About
          </Link>
        </Button>
        <p className="text-sm font-medium">© 2026 Swagger Editor</p>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GraduationCap data-icon="inline-start" />
            RS School
          </a>
        </Button>
      </div>
    </footer>
  );
}
