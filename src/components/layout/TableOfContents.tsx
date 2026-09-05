import type { TocHeading } from '@/types';

interface TableOfContentsProps {
  headings: TocHeading[];
  activeId: string;
  onClickHeading: (id: string) => void;
}

export default function TableOfContents({
  headings,
  activeId,
  onClickHeading,
}: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav
      className="py-4 px-3"
      aria-label="On this page"
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-3 px-2"
        style={{ color: 'var(--text-muted)' }}
      >
        On This Page
      </p>

      <ul className="space-y-0.5" role="list">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <button
                onClick={() => onClickHeading(heading.id)}
                className={`w-full text-left text-sm px-2 py-1 rounded-md
                             transition-colors duration-100
                             ${heading.level === 3 ? 'pl-5' : ''}
                             ${isActive
                               ? 'text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-950/30'
                               : 'hover:bg-raised'
                             }`}
                style={!isActive ? { color: 'var(--text-muted)' } : undefined}
              >
                <span className="line-clamp-2 text-left">{heading.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
