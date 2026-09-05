// ─────────────────────────────────────────────────────────────────────────────
// Content Engine
// Discovers all Markdown files in content/ at build time using import.meta.glob.
// Parses YAML frontmatter and builds typed Note objects + NavTree.
// Adding a new content/category/topic/index.md requires ZERO React changes.
// ─────────────────────────────────────────────────────────────────────────────

import { parseFrontmatter } from './frontmatter';
import type { Note, NoteMetadata, NavCategory, NavTree, NoteFrontmatter } from '@/types';
import { slugToLabel } from './utils';

// ── Category display order ────────────────────────────────────────────────────
const CATEGORY_ORDER: Record<string, number> = {
  'dsa':               0,
  'backend':           1,
  'frontend':          2,
  'databases':         3,
  'operating-systems': 4,
  'computer-networks': 5,
  'system-design':     6,
};

// ── Category display labels (override auto-slugged labels) ────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  'dsa':               'DSA',
  'backend':           'Backend',
  'frontend':          'Frontend',
  'databases':         'Databases',
  'operating-systems': 'Operating Systems',
  'computer-networks': 'Computer Networks',
  'system-design':     'System Design',
};

// ── Raw Markdown glob ─────────────────────────────────────────────────────────
// Vite resolves this at build time — all Markdown files become eager imports.
const rawFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// ── Parse all notes once ──────────────────────────────────────────────────────
function parseNotes(): Note[] {
  const notes: Note[] = [];

  for (const [filePath, rawContent] of Object.entries(rawFiles)) {
    // filePath example: "/content/backend/rest-api/index.md"
    const parts = filePath.replace(/^\/content\//, '').split('/');
    if (parts.length < 2) continue;

    const categorySlug = parts[0];
    const topicSlug    = parts[1];

    if (!categorySlug || !topicSlug) continue;

    let parsed: { data: NoteFrontmatter; content: string };
    try {
      parsed = parseFrontmatter<NoteFrontmatter>(rawContent);
    } catch {
      console.warn(`[content] Failed to parse frontmatter in ${filePath}`);
      continue;
    }

    const fm = parsed.data;
    if (!fm.title) {
      // If no title in frontmatter, derive from slug
      fm.title = slugToLabel(topicSlug);
    }
    if (!fm.category) {
      fm.category = CATEGORY_LABELS[categorySlug] ?? slugToLabel(categorySlug);
    }
    if (!fm.topic) {
      fm.topic = fm.title;
    }

    const path = `/${categorySlug}/${topicSlug}`;

    notes.push({
      ...fm,
      tags:         fm.tags ?? [],
      categorySlug,
      topicSlug,
      path,
      content: parsed.content,
    });
  }

  return notes;
}

// ── Cached data ───────────────────────────────────────────────────────────────
let _notes: Note[] | null = null;

function getNotes(): Note[] {
  if (!_notes) _notes = parseNotes();
  return _notes;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Return all notes as metadata (without content) */
export function getAllNotes(): NoteMetadata[] {
  return getNotes().map(({ content: _c, ...meta }) => meta);
}

/** Return a single note (with content) by category + topic slug */
export function getNoteBySlug(categorySlug: string, topicSlug: string): Note | undefined {
  return getNotes().find(
    (n) => n.categorySlug === categorySlug && n.topicSlug === topicSlug
  );
}

/** Build the full navigation tree from discovered notes */
export function getNavTree(): NavTree {
  const notes = getNotes();
  const categoryMap = new Map<string, NavCategory>();

  for (const note of notes) {
    const { categorySlug, topicSlug, title, path } = note;

    if (!categoryMap.has(categorySlug)) {
      categoryMap.set(categorySlug, {
        label:       CATEGORY_LABELS[categorySlug] ?? slugToLabel(categorySlug),
        categorySlug,
        topics:      [],
        order:       CATEGORY_ORDER[categorySlug] ?? 99,
      });
    }

    const cat = categoryMap.get(categorySlug)!;
    // Avoid duplicates (shouldn't happen, but be safe)
    if (!cat.topics.find((t) => t.topicSlug === topicSlug)) {
      cat.topics.push({
        label:     title,
        topicSlug,
        path,
        order:     note.order ?? 999,
      });
    }
  }

  // Sort topics within each category by order, then alphabetically
  for (const cat of categoryMap.values()) {
    cat.topics.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  }

  // Sort categories by order
  return Array.from(categoryMap.values()).sort((a, b) => a.order - b.order);
}

/** Get notes related to a given note by shared tags */
export function getRelatedNotes(note: NoteMetadata, limit = 5): NoteMetadata[] {
  if (!note.tags || note.tags.length === 0) return [];

  const tagSet = new Set(note.tags);
  return getAllNotes()
    .filter((n) => n.path !== note.path)
    .map((n) => ({
      note: n,
      score: (n.tags ?? []).filter((t) => tagSet.has(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ note: n }) => n);
}

/** Get prev/next notes within the same category (ordered) */
export function getPrevNext(note: NoteMetadata): { prev?: NoteMetadata; next?: NoteMetadata } {
  const all = getAllNotes();
  const inCategory = all
    .filter((n) => n.categorySlug === note.categorySlug)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

  const idx = inCategory.findIndex((n) => n.topicSlug === note.topicSlug);
  return {
    prev: idx > 0 ? inCategory[idx - 1] : undefined,
    next: idx < inCategory.length - 1 ? inCategory[idx + 1] : undefined,
  };
}

/** Get recently added notes (sorted by date desc) */
export function getRecentNotes(limit = 6): NoteMetadata[] {
  return getAllNotes()
    .filter((n) => !!n.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, limit);
}
