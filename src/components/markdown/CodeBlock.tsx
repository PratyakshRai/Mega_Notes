import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  highlightedHtml?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript', javascript: 'JavaScript',
  ts: 'TypeScript', typescript: 'TypeScript',
  jsx: 'JSX', tsx: 'TSX',
  py: 'Python', python: 'Python',
  java: 'Java',
  cpp: 'C++', c: 'C',
  go: 'Go', golang: 'Go',
  rs: 'Rust', rust: 'Rust',
  sh: 'Shell', bash: 'Bash', zsh: 'Shell',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML', yml: 'YAML',
  html: 'HTML',
  css: 'CSS',
  md: 'Markdown', markdown: 'Markdown',
  dockerfile: 'Dockerfile',
  text: 'Text', txt: 'Text',
};

export default function CodeBlock({ code, language, highlightedHtml }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const langLabel = language ? (LANGUAGE_LABELS[language.toLowerCase()] ?? language.toUpperCase()) : null;

  return (
    <div
      className="relative group rounded-xl overflow-hidden my-5 border border-base"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-base"
        style={{ backgroundColor: 'var(--bg-raised)', borderColor: 'var(--border)' }}
      >
        {langLabel ? (
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-muted)' }}>
            {langLabel}
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md
                       transition-all duration-150 font-medium
                       ${copied
                         ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                         : 'hover:bg-surface'
                       }`}
          style={!copied ? { color: 'var(--text-muted)' } : undefined}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* ── Code content ───────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        {highlightedHtml ? (
          <pre
            className="hljs p-4 text-sm leading-relaxed m-0 font-mono"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </pre>
        ) : (
          <pre
            className="p-4 text-sm leading-relaxed m-0 font-mono"
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              backgroundColor: 'var(--bg-raised)',
              color: 'var(--text-base)',
            }}
          >
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
