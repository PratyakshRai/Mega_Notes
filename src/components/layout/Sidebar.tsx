import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getNavTree } from '@/lib/content';

interface SidebarProps {
  currentPath: string;
  onNavigate?: () => void;
}

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const navTree = getNavTree();

  // Track which categories are open
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    // By default, open the category of the current page
    const initial = new Set<string>();
    for (const cat of navTree) {
      if (cat.topics.some((t) => t.path === currentPath)) {
        initial.add(cat.categorySlug);
      }
    }
    // If no match, open all categories
    if (initial.size === 0) {
      for (const cat of navTree) initial.add(cat.categorySlug);
    }
    return initial;
  });

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <nav
      className="py-4 px-3"
      aria-label="Documentation navigation"
    >
      {navTree.map((category) => {
        const isOpen = openCategories.has(category.categorySlug);
        const hasActive = category.topics.some((t) => t.path === currentPath);

        return (
          <div key={category.categorySlug} className="mb-1">
            {/* ── Category header ──────────────────────────────────── */}
            <button
              onClick={() => toggleCategory(category.categorySlug)}
              className="w-full flex items-center justify-between px-2 py-1.5
                         rounded-md text-xs font-semibold uppercase tracking-wider
                         transition-colors duration-150 hover:bg-raised"
              style={{
                color: hasActive ? '#3b72f6' : 'var(--text-muted)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-raised)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-expanded={isOpen}
            >
              <span>{category.label}</span>
              {isOpen ? (
                <ChevronDown size={13} />
              ) : (
                <ChevronRight size={13} />
              )}
            </button>

            {/* ── Topics list ──────────────────────────────────────── */}
            {isOpen && (
              <ul className="mt-0.5 ml-1 space-y-0.5" role="list">
                {category.topics.map((topic) => {
                  const isActive = topic.path === currentPath;
                  return (
                    <li key={topic.topicSlug}>
                      <Link
                        to={topic.path}
                        onClick={onNavigate}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm
                                    transition-colors duration-100
                                    ${isActive
                                      ? 'sidebar-link-active'
                                      : 'hover:bg-raised'
                                    }`}
                        style={!isActive ? { color: 'var(--text-base)' } : undefined}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {topic.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}

      {/* Bottom padding */}
      <div className="h-8" />
    </nav>
  );
}
