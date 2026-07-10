import { useCallback, useEffect, useState } from 'react';
import { useScrollStore } from '@/store/scrollStore';

export function useScrollSync() {
  const setScrolled = useScrollStore((s) => s.setScrolled);
  const [node, setNode] = useState<HTMLElement | null>(null);

  const ref = useCallback((el: HTMLElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    setScrolled(node.scrollTop > 0);

    function handleScroll() {
      setScrolled((node?.scrollTop ?? 0) > 0);
    }

    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, [node, setScrolled]);

  return ref;
}
