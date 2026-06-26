import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-t backdrop-blur">
      <div className="container flex h-16 items-center justify-center gap-10">
        <Link href="/about" className="text-sm font-medium hover:underline">
          About
        </Link>
        <a
          href="https://rs.school/courses/reactjs"
          className="text-sm font-medium hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School
        </a>
      </div>
    </footer>
  );
}
