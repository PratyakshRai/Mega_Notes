// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for Mega Revision Notes
// ─────────────────────────────────────────────────────────────────────────────

/** Difficulty level of a note */
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/** Source metadata (optional — only when user provides it) */
export interface NoteSource {
  title: string;
  youtube?: string;
}

/** YAML frontmatter parsed from a Markdown file */
export interface NoteFrontmatter {
  title: string;
  category: string;
  topic: string;
  difficulty?: Difficulty;
  tags?: string[];
  description?: string;
  source?: NoteSource;
  order?: number; // optional ordering within a category
  date?: string; // ISO date string for "recently added"
}

/** A fully resolved note with slug info */
export interface NoteMetadata extends NoteFrontmatter {
  /** e.g. "backend" */
  categorySlug: string;
  /** e.g. "rest-api" */
  topicSlug: string;
  /** Folder path between the category and topic, e.g. "YouTube / By Sriniously" */
  groupPath?: string;
  /** Full URL path: "/backend/rest-api" */
  path: string;
}

/** A note with its raw Markdown content */
export interface Note extends NoteMetadata {
  content: string;
}

/** A single item in the sidebar navigation */
export interface NavTopic {
  label: string;
  topicSlug: string;
  path: string;
  order: number;
  groupPath?: string;
}

/** A category grouping in the sidebar */
export interface NavCategory {
  label: string;
  categorySlug: string;
  topics: NavTopic[];
  order: number;
}

/** The full navigation tree */
export type NavTree = NavCategory[];

/** A single search result */
export interface SearchResult {
  title: string;
  category: string;
  categorySlug: string;
  topicSlug: string;
  path: string;
  tags: string[];
  description?: string;
}

/** Heading extracted from rendered content for TOC */
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}
