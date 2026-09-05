// ─────────────────────────────────────────────────────────────────────────────
// Browser-compatible frontmatter parser
// gray-matter uses Node.js Buffer, which is not available in browser.
// This replaces it with a simple regex-based parser + js-yaml.
// ─────────────────────────────────────────────────────────────────────────────

import { load as yamlLoad } from 'js-yaml';

interface ParsedFrontmatter<T = Record<string, unknown>> {
  data: T;
  content: string;
}

/**
 * Parse YAML frontmatter from a Markdown string.
 * Expects the format:
 * ```
 * ---
 * key: value
 * ---
 * # Markdown content
 * ```
 */
export function parseFrontmatter<T = Record<string, unknown>>(raw: string): ParsedFrontmatter<T> {
  // Normalize line endings to \n
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const trimmed = normalized.trimStart();

  // Check if the file starts with ---
  if (!trimmed.startsWith('---')) {
    return { data: {} as T, content: raw };
  }

  // Find the closing --- (must be on its own line)
  const match = trimmed.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) {
    return { data: {} as T, content: raw };
  }

  const yamlStr = match[1];
  const content = trimmed.slice(match[0].length);

  let data: T;
  try {
    data = (yamlLoad(yamlStr) as T) ?? ({} as T);
  } catch (e) {
    console.warn('[frontmatter] Failed to parse YAML:', (e as Error).message);
    data = {} as T;
  }

  return { data, content };
}
