import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import type { Element } from 'hast';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';
import {
  CalloutBox,
  QuickRevision,
  InterviewQuestion,
  InterviewSection,
} from './CustomComponents';

// ─────────────────────────────────────────────────────────────────────────────
// Custom directive parser
// Parses :::type [title] ... ::: blocks from the raw Markdown string
// before passing to ReactMarkdown.
// ─────────────────────────────────────────────────────────────────────────────

interface Directive {
  type: string;
  title: string;
  content: string;
}

type ParsedBlock =
  | { kind: 'text'; text: string }
  | { kind: 'directive'; directive: Directive };

function parseDirectives(markdown: string): ParsedBlock[] {
  const result: ParsedBlock[] = [];
  // Match :::type optional-title\n...content...\n:::
  const pattern = /^:::(\w+)(?:\s+(.+?))?\s*\n([\s\S]*?)^:::/gm;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex
  pattern.lastIndex = 0;

  while ((match = pattern.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      result.push({ kind: 'text', text: markdown.slice(lastIndex, match.index) });
    }
    result.push({
      kind: 'directive',
      directive: {
        type: match[1],
        title: match[2] ?? '',
        content: match[3],
      },
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markdown.length) {
    result.push({ kind: 'text', text: markdown.slice(lastIndex) });
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview questions parser
// Parses Q: ... A: ... blocks into structured data
// ─────────────────────────────────────────────────────────────────────────────

interface QA {
  question: string;
  answer: string;
}

function parseInterviewQuestions(content: string): QA[] {
  const qas: QA[] = [];
  const qPattern = /^Q\d*[:.]\s*(.+?)(?=^A[:.]\s*)/gms;
  const aPattern = /^A\d*[:.]\s*([\s\S]+?)(?=^Q\d*[:.]\s*|$)/gm;

  const questions = [...content.matchAll(qPattern)].map((m) => m[1].trim());
  const answers   = [...content.matchAll(aPattern)].map((m) => m[1].trim());

  for (let i = 0; i < questions.length; i++) {
    qas.push({ question: questions[i], answer: answers[i] ?? '' });
  }

  return qas;
}

// ─────────────────────────────────────────────────────────────────────────────
// Render a directive block into a React component
// ─────────────────────────────────────────────────────────────────────────────

function renderDirective(directive: Directive, key: string): React.ReactNode {
  const { type, title, content } = directive;

  switch (type) {
    case 'info':
    case 'warning':
    case 'tip':
    case 'danger':
    case 'definition':
      return (
        <CalloutBox key={key} type={type} title={title || undefined}>
          <ReactMarkdownBlock content={content} />
        </CalloutBox>
      );

    case 'revision':
    case 'quick-revision':
      return (
        <QuickRevision key={key}>
          <ReactMarkdownBlock content={content} />
        </QuickRevision>
      );

    case 'interview':
    case 'interview-questions': {
      const qas = parseInterviewQuestions(content);
      if (qas.length > 0) {
        return (
          <InterviewSection key={key}>
            {qas.map((qa, i) => (
              <InterviewQuestion key={i} question={qa.question} index={i + 1}>
                <ReactMarkdownBlock content={qa.answer} />
              </InterviewQuestion>
            ))}
          </InterviewSection>
        );
      }
      // Fallback: raw content
      return (
        <InterviewSection key={key}>
          <ReactMarkdownBlock content={content} />
        </InterviewSection>
      );
    }

    default:
      // Unknown directive — render as callout info
      return (
        <CalloutBox key={key} type="info" title={title || type}>
          <ReactMarkdownBlock content={content} />
        </CalloutBox>
      );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ReactMarkdown component overrides
// ─────────────────────────────────────────────────────────────────────────────

const markdownComponents: Components = {
  // Custom code block renderer
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : undefined;
    const rawCode = String(children).replace(/\n$/, '');

    // Check if this is an inline code (no language, short)
    const isInline = !match && !String(children).includes('\n');

    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: 'var(--bg-raised)',
            color: 'var(--text-base)',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
          {...props}
        >
          {children}
        </code>
      );
    }

    // Mermaid diagrams
    if (language === 'mermaid') {
      return <MermaidDiagram code={rawCode} />;
    }

    // Get pre-highlighted HTML from rehype-highlight
    const highlightedHtml = (props as { 'data-highlighted'?: string })['data-highlighted'];

    return (
      <CodeBlock
        code={rawCode}
        language={language}
        highlightedHtml={highlightedHtml}
      />
    );
  },

  // Unwrap the default <pre> wrapping since CodeBlock handles its own container
  pre({ children }) {
    return <>{children}</>;
  },

  // Responsive tables
  table({ children }) {
    return (
      <div className="overflow-x-auto my-6 rounded-lg border border-base"
           style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th
        className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider
                   border-b border-base"
        style={{ backgroundColor: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td
        className="px-4 py-2.5 border-b border-base text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-base)' }}
      >
        {children}
      </td>
    );
  },

  // Responsive images
  img({ src, alt }) {
    return (
      <figure className="my-6 not-prose">
        <img
          src={src}
          alt={alt ?? ''}
          className="w-full rounded-lg border border-base max-w-full"
          style={{ borderColor: 'var(--border)' }}
          loading="lazy"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  // Blockquote
  blockquote({ children }) {
    return (
      <blockquote
        className="my-4 pl-4 border-l-4 border-brand-400 dark:border-brand-500
                   italic text-sm leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        {children}
      </blockquote>
    );
  },

  // External links open in new tab
  a({ href, children }) {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-brand-600 dark:text-brand-400 hover:underline"
      >
        {children}
      </a>
    );
  },

  // Horizontal rule
  hr() {
    return <hr className="my-8 border-t border-base" style={{ borderColor: 'var(--border)' }} />;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper — renders a Markdown string block
// ─────────────────────────────────────────────────────────────────────────────

function ReactMarkdownBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        rehypeRaw,
        [rehypeHighlight, { detect: true, ignoreMissing: true }],
      ]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-process: extract code blocks before directive parsing
// to avoid directive regex matching inside code
// ─────────────────────────────────────────────────────────────────────────────

function extractCodeBlocks(md: string): { processed: string; codeBlocks: string[] } {
  const codeBlocks: string[] = [];
  const processed = md.replace(/```[\s\S]*?```/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `%%CODE_BLOCK_${idx}%%`;
  });
  return { processed, codeBlocks };
}

function restoreCodeBlocks(md: string, codeBlocks: string[]): string {
  return md.replace(/%%CODE_BLOCK_(\d+)%%/g, (_, idx) => codeBlocks[parseInt(idx, 10)]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main MarkdownRenderer component
// ─────────────────────────────────────────────────────────────────────────────

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 1. Extract code blocks first (protect them from directive regex)
  const { processed, codeBlocks } = extractCodeBlocks(content);

  // 2. Parse custom :::directive::: blocks
  const blocks = parseDirectives(processed);

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none
                 prose-headings:scroll-mt-20
                 prose-code:before:content-none prose-code:after:content-none"
    >
      {blocks.map((block, idx) => {
        if (block.kind === 'directive') {
          return renderDirective(block.directive, String(idx));
        }
        // Restore code blocks in text blocks
        const restored = restoreCodeBlocks(block.text, codeBlocks);
        return <ReactMarkdownBlock key={idx} content={restored} />;
      })}
    </div>
  );
}
