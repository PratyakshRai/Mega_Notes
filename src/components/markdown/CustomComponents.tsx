import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Callout Boxes
// ─────────────────────────────────────────────────────────────────────────────

interface CalloutBoxProps {
  type: 'info' | 'warning' | 'tip' | 'danger' | 'definition';
  title?: string;
  children: React.ReactNode;
}

const CALLOUT_CONFIG = {
  info:       { icon: 'ℹ️',  label: 'Info',       className: 'callout-info'       },
  warning:    { icon: '⚠️',  label: 'Warning',    className: 'callout-warning'    },
  tip:        { icon: '💡',  label: 'Tip',        className: 'callout-tip'        },
  danger:     { icon: '🚨',  label: 'Important',  className: 'callout-danger'     },
  definition: { icon: '📖',  label: 'Definition', className: 'callout-definition' },
};

export function CalloutBox({ type, title, children }: CalloutBoxProps) {
  const config = CALLOUT_CONFIG[type];

  return (
    <div className={`callout ${config.className} not-prose`} role="note">
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden="true">{config.icon}</span>
        <span className="text-sm font-semibold">{title ?? config.label}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Revision
// ─────────────────────────────────────────────────────────────────────────────

interface QuickRevisionProps {
  children: React.ReactNode;
}

export function QuickRevision({ children }: QuickRevisionProps) {
  return (
    <div
      className="not-prose rounded-xl border-2 border-brand-500/40 dark:border-brand-400/30
                 bg-brand-50 dark:bg-brand-950/20 p-5 my-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg" aria-hidden="true">⚡</span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
          Quick Revision
        </h3>
      </div>
      <div className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--text-base)' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview Question (expandable)
// ─────────────────────────────────────────────────────────────────────────────

interface InterviewQuestionProps {
  question: string;
  children: React.ReactNode;
  index?: number;
}

export function InterviewQuestion({ question, children, index }: InterviewQuestionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="not-prose border border-base rounded-lg overflow-hidden my-3"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3
                   text-left transition-colors duration-150 hover:bg-raised"
        style={{ backgroundColor: 'transparent' }}
        aria-expanded={open}
      >
        <span className="flex items-start gap-2 text-sm font-medium" style={{ color: 'var(--text-base)' }}>
          {index !== undefined && (
            <span
              className="mt-0.5 shrink-0 text-xs font-bold w-5 h-5 rounded flex items-center
                         justify-center bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
            >
              {index}
            </span>
          )}
          {question}
        </span>
        <span
          className="shrink-0 mt-0.5 transition-transform duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <div className={`interview-answer ${open ? 'open' : 'closed'}`}>
        <div
          className="px-4 pb-4 pt-2 text-sm leading-relaxed border-t border-base"
          style={{ borderColor: 'var(--border)', color: 'var(--text-base)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview Questions section wrapper
// ─────────────────────────────────────────────────────────────────────────────

interface InterviewSectionProps {
  children: React.ReactNode;
}

export function InterviewSection({ children }: InterviewSectionProps) {
  return (
    <div className="not-prose my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg" aria-hidden="true">🎯</span>
        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Interview Questions
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YouTube Timestamp Link
// ─────────────────────────────────────────────────────────────────────────────

interface YouTubeTimestampProps {
  url: string;
  timestamp: string;
  label?: string;
}

export function YouTubeTimestamp({ url, timestamp, label }: YouTubeTimestampProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                 text-sm font-medium border border-red-200 dark:border-red-900/40
                 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400
                 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors duration-150"
    >
      <span aria-hidden="true">🎥</span>
      <span>{label ? label : `Explained at ${timestamp}`}</span>
    </a>
  );
}
