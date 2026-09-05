// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a slug like "rest-api" → "REST API" (title-cased) */
export function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => {
      // Keep common acronyms uppercase
      const upper = word.toUpperCase();
      const acronyms = ['api', 'http', 'url', 'jwt', 'sql', 'nosql', 'css', 'html', 'dom', 'os', 'tcp', 'udp', 'dns', 'cdn', 'ci', 'cd', 'aws', 'gcp', 'sdk', 'rest', 'rpc', 'orm', 'dsa'];
      if (acronyms.includes(word.toLowerCase())) return upper;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/** Format ISO date string to readable form */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Copy text to clipboard, returns promise */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

/** Extract plain text from a string (strip Markdown) */
export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
