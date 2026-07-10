'use client';

import { usePathname } from 'next/navigation';

export function useActivePath() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (!pathname) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  return isActive;
}
