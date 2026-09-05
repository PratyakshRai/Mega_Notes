// ─────────────────────────────────────────────────────────────────────────────
// Client-side search engine using FlexSearch
// Indexes all note metadata + content once, then searches on query.
// ─────────────────────────────────────────────────────────────────────────────

import { Document } from 'flexsearch';
import { getAllNotes } from './content';
import type { NoteMetadata, SearchResult } from '@/types';

interface SearchDoc {
  [key: string]: string;
  id: string;
  title: string;
  category: string;
  topic: string;
  tags: string;
  description: string;
  categorySlug: string;
  topicSlug: string;
  path: string;
}

// ── Build index ───────────────────────────────────────────────────────────────
let _index: Document<SearchDoc> | null = null;
let _notesMap: Map<string, NoteMetadata> | null = null;

function buildIndex(): void {
  const notes = getAllNotes();

  _index = new Document<SearchDoc>({
    document: {
      id: 'id',
      index: ['title', 'category', 'topic', 'tags', 'description'],
      store: true,
    },
    tokenize: 'forward',
  });

  _notesMap = new Map();

  for (const note of notes) {
    const id = note.path;
    const doc: SearchDoc = {
      id,
      title:       note.title,
      category:    note.category,
      topic:       note.topic ?? note.title,
      tags:        (note.tags ?? []).join(' '),
      description: note.description ?? '',
      categorySlug: note.categorySlug,
      topicSlug:   note.topicSlug,
      path:        note.path,
    };
    _index.add(doc);
    _notesMap.set(id, note);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Search notes by query string. Returns up to `limit` results. */
export function searchNotes(query: string, limit = 10): SearchResult[] {
  if (!query.trim()) return [];

  if (!_index || !_notesMap) buildIndex();

  const results = _index!.search(query, { limit, enrich: true });

  // Collect unique paths from all field results
  const seen = new Set<string>();
  const matches: SearchResult[] = [];

  for (const fieldResult of results) {
    for (const item of fieldResult.result) {
      const stored = item.doc as SearchDoc;
      if (!stored || seen.has(stored.path)) continue;
      seen.add(stored.path);

      matches.push({
        title:       stored.title,
        category:    stored.category,
        categorySlug: stored.categorySlug,
        topicSlug:   stored.topicSlug,
        path:        stored.path,
        tags:        stored.tags.split(' ').filter(Boolean),
        description: stored.description || undefined,
      });
    }
  }

  return matches.slice(0, limit);
}

/** Eagerly initialize the index (call on app startup) */
export function initSearchIndex(): void {
  if (!_index) buildIndex();
}
