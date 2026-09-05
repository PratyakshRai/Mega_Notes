import { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Tag, ChevronRight, ChevronLeft, ExternalLink, BookOpen } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import { getNoteBySlug, getRelatedNotes, getPrevNext } from '@/lib/content';
import { formatDate } from '@/lib/utils';

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner:     'bg-green-50  dark:bg-green-950/30  text-green-700  dark:text-green-400  border-green-200  dark:border-green-800',
  Intermediate: 'bg-amber-50  dark:bg-amber-950/30  text-amber-700  dark:text-amber-400  border-amber-200  dark:border-amber-800',
  Advanced:     'bg-red-50    dark:bg-red-950/30    text-red-700    dark:text-red-400    border-red-200    dark:border-red-800',
};

export default function NotePage() {
  const { categorySlug = '', topicSlug = '' } = useParams<{
    categorySlug: string;
    topicSlug: string;
  }>();

  const contentRef = useRef<HTMLElement | null>(null);
  const note = getNoteBySlug(categorySlug, topicSlug);

  if (!note) {
    return <Navigate to="/404" replace />;
  }

  const related = getRelatedNotes(note, 5);
  const { prev, next } = getPrevNext(note);

  return (
    <PageLayout showSidebar showTOC contentRef={contentRef}>
      {/* Set document title */}
      <title>{note.title} — Mega Revision Notes</title>

      <article
        ref={contentRef as React.RefObject<HTMLElement>}
        className="px-4 sm:px-8 lg:px-12 py-10 max-w-[780px]"
        aria-labelledby="note-title"
      >
        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-xs mb-6" aria-label="Breadcrumb"
             style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="capitalize">{note.category}</span>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--text-base)' }}>{note.title}</span>
        </nav>

        {/* ── Title ──────────────────────────────────────────────────── */}
        <h1
          id="note-title"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight"
          style={{ color: 'var(--text-base)' }}
        >
          {note.title}
        </h1>

        {/* ── Description ────────────────────────────────────────────── */}
        {note.description && (
          <p className="text-lg mb-5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {note.description}
          </p>
        )}

        {/* ── Metadata row ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-base"
             style={{ borderColor: 'var(--border)' }}>
          {/* Category */}
          <span
            className="text-xs px-2.5 py-1 rounded-full border font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-raised)' }}
          >
            {note.category}
          </span>

          {/* Difficulty */}
          {note.difficulty && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-medium ${DIFFICULTY_STYLES[note.difficulty]}`}
            >
              {note.difficulty}
            </span>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag size={11} style={{ color: 'var(--text-subtle)' }} />
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Date */}
          {note.date && (
            <span className="text-xs ml-auto" style={{ color: 'var(--text-subtle)' }}>
              {formatDate(note.date)}
            </span>
          )}
        </div>

        {/* ── Source ─────────────────────────────────────────────────── */}
        {note.source && (
          <div
            className="flex items-center gap-4 p-4 rounded-xl border border-base mb-8
                       bg-raised"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-raised)' }}
          >
            <span className="text-2xl" aria-hidden="true">🎥</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                 style={{ color: 'var(--text-muted)' }}>Source</p>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-base)' }}>
                {note.source.title}
              </p>
            </div>
            {note.source.youtube && (
              <a
                href={note.source.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5
                           rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors
                           shrink-0"
              >
                Watch
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* ── Main content ───────────────────────────────────────────── */}
        <MarkdownRenderer content={note.content} />

        {/* ── Related Topics ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-base" style={{ borderColor: 'var(--border)' }}>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              Related Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.path}
                  to={r.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-base
                             text-sm hover:border-brand-400 dark:hover:border-brand-500
                             hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-base)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <BookOpen size={13} style={{ color: 'var(--text-muted)' }} />
                  {r.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Prev / Next navigation ─────────────────────────────────── */}
        {(prev || next) && (
          <nav
            className="mt-10 pt-8 border-t border-base grid grid-cols-2 gap-4"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Topic navigation"
          >
            {prev ? (
              <Link
                to={prev.path}
                className="group flex flex-col gap-1 p-4 rounded-xl border border-base
                           hover:border-brand-400 dark:hover:border-brand-500 transition-colors
                           text-left"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                <span className="flex items-center gap-1 text-xs"
                      style={{ color: 'var(--text-muted)' }}>
                  <ChevronLeft size={12} /> Previous
                </span>
                <span
                  className="text-sm font-medium group-hover:text-brand-600
                              dark:group-hover:text-brand-400 transition-colors"
                  style={{ color: 'var(--text-base)' }}
                >
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                to={next.path}
                className="group flex flex-col gap-1 p-4 rounded-xl border border-base
                           hover:border-brand-400 dark:hover:border-brand-500 transition-colors
                           text-right col-start-2"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
              >
                <span className="flex items-center justify-end gap-1 text-xs"
                      style={{ color: 'var(--text-muted)' }}>
                  Next <ChevronRight size={12} />
                </span>
                <span
                  className="text-sm font-medium group-hover:text-brand-600
                              dark:group-hover:text-brand-400 transition-colors"
                  style={{ color: 'var(--text-base)' }}
                >
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </article>
    </PageLayout>
  );
}
