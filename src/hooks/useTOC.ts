// ─────────────────────────────────────────────────────────────────────────────
// useTOC — extracts headings from the rendered note and tracks active section
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { TocHeading } from '@/types';

export function useTOC(contentRef: React.RefObject<HTMLElement | null>) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from rendered DOM
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const els = container.querySelectorAll('h2, h3');
    const extracted: TocHeading[] = [];

    els.forEach((el) => {
      const id = el.id;
      const text = el.textContent ?? '';
      const level = Number(el.tagName[1]) as 2 | 3;
      if (id && text) {
        extracted.push({ id, text, level });
      }
    });

    setHeadings(extracted);
  }, [contentRef]);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const headingEls = headings
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-60px 0px -60% 0px',
        threshold: 0,
      }
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { headings, activeId, scrollTo };
}
