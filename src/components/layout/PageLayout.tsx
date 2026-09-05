import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import TableOfContents from './TableOfContents';
import { useTOC } from '@/hooks/useTOC';

interface PageLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showTOC?: boolean;
  contentRef?: React.RefObject<HTMLElement | null>;
}

export default function PageLayout({
  children,
  showSidebar = true,
  showTOC = true,
  contentRef: externalContentRef,
}: PageLayoutProps) {
  const location = useLocation();
  const internalRef = useRef<HTMLElement | null>(null);
  const contentRef = externalContentRef ?? internalRef;
  const { headings, activeId, scrollTo } = useTOC(contentRef);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <Header />

      <div className="flex pt-[60px]">
        {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
        {showSidebar && (
          <aside
            className="hidden lg:block fixed top-[60px] left-0 bottom-0 w-[280px]
                       overflow-y-auto border-r border-base shrink-0"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            aria-label="Sidebar navigation"
          >
            <Sidebar currentPath={location.pathname} />
          </aside>
        )}

        {/* ── Main content ────────────────────────────────────────────── */}
        <main
          className={`flex-1 min-w-0 ${showSidebar ? 'lg:ml-[280px]' : ''} ${showTOC ? 'xl:mr-[240px]' : ''}`}
          ref={internalRef as React.RefObject<HTMLElement>}
        >
          {children}
        </main>

        {/* ── Desktop TOC ─────────────────────────────────────────────── */}
        {showTOC && headings.length > 0 && (
          <aside
            className="hidden xl:block fixed top-[60px] right-0 bottom-0 w-[240px]
                       overflow-y-auto border-l border-base shrink-0"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            aria-label="Table of contents"
          >
            <TableOfContents
              headings={headings}
              activeId={activeId}
              onClickHeading={scrollTo}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
