import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function NotFoundPage() {
  return (
    <PageLayout showSidebar={false} showTOC={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div
          className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8
                     border-2 border-dashed border-base"
          style={{ borderColor: 'var(--border)' }}
        >
          <BookOpen size={32} style={{ color: 'var(--text-subtle)' }} />
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          404 — Not Found
        </p>

        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-base)' }}>
          This topic doesn't exist yet.
        </h1>

        <p className="text-base max-w-md mb-8" style={{ color: 'var(--text-muted)' }}>
          The note you're looking for hasn't been added yet. Content will appear
          here once it's provided and published.
        </p>

        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg
                     bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm
                     transition-colors duration-150"
        >
          <ArrowLeft size={16} />
          Back to Mega Revision Notes
        </Link>
      </div>
    </PageLayout>
  );
}
