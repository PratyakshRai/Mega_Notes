import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResult } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { results, isSearching } = useSearch(query);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        navigateTo(results[activeIndex]);
      }
    },
    [results, activeIndex, onClose]
  );

  const navigateTo = useCallback(
    (result: SearchResult) => {
      navigate(result.path);
      onClose();
    },
    [navigate, onClose]
  );

  // Global keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Toggle is handled by Header
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group results by category
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  let flatIndex = 0;
  const flatResults: { result: SearchResult; index: number }[] = [];
  for (const group of Object.values(grouped)) {
    for (const r of group) {
      flatResults.push({ result: r, index: flatIndex++ });
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed z-50 top-[10vh] left-1/2 -translate-x-1/2 w-full max-w-2xl
                   mx-4 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ backgroundColor: 'var(--bg-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Search notes"
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-base"
          style={{ borderColor: 'var(--border)' }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics, tags, categories…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--text-subtle)]"
            style={{ color: 'var(--text-base)' }}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-raised transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded border border-base font-mono"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[60vh]">
          {!query && (
            <div className="px-5 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Type to search across all notes…</p>
            </div>
          )}

          {query && isSearching && (
            <div className="px-5 py-6 text-center" style={{ color: 'var(--text-muted)' }}>
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {query && !isSearching && results.length === 0 && (
            <div className="px-5 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
              <p className="text-sm">No results found for <strong>"{query}"</strong></p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
                Try a different keyword or tag.
              </p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <ul className="py-2" role="listbox" aria-label="Search results">
              {flatResults.map(({ result, index }) => {
                const isActive = index === activeIndex;
                return (
                  <li key={result.path} role="option" aria-selected={isActive}>
                    <button
                      onClick={() => navigateTo(result)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full flex items-start gap-3 px-5 py-3 text-left
                                   transition-colors duration-100
                                   ${isActive ? 'bg-brand-50 dark:bg-brand-950/30' : 'hover:bg-raised'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-2xs px-2 py-0.5 rounded-full font-medium border border-base"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-raised)' }}
                          >
                            {result.category}
                          </span>
                        </div>
                        <p
                          className={`mt-0.5 text-sm font-medium truncate
                                      ${isActive ? 'text-brand-700 dark:text-brand-300' : ''}`}
                          style={!isActive ? { color: 'var(--text-base)' } : undefined}
                        >
                          {result.title}
                        </p>
                        {result.description && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                            {result.description}
                          </p>
                        )}
                        {result.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            <Tag size={10} style={{ color: 'var(--text-subtle)' }} />
                            {result.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="text-2xs" style={{ color: 'var(--text-subtle)' }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight
                        size={14}
                        className={`shrink-0 mt-1 transition-opacity ${isActive ? 'opacity-100 text-brand-500' : 'opacity-0'}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2.5 border-t border-base flex items-center gap-4 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}
        >
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
          {results.length > 0 && (
            <span className="ml-auto">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </>
  );
}
