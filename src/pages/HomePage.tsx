import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Code2,
  Database,
  Cpu,
  Network,
  GitBranch,
  Globe,
  Sparkles,
  Zap,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { getNavTree, getRecentNotes } from "@/lib/content";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  dsa: <Code2 size={22} />,
  backend: <Zap size={22} />,
  frontend: <Globe size={22} />,
  databases: <Database size={22} />,
  "operating-systems": <Cpu size={22} />,
  "computer-networks": <Network size={22} />,
  "system-design": <GitBranch size={22} />,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  dsa: "Arrays, trees, graphs, sorting, dynamic programming and more.",
  backend: "Node.js, APIs, auth, databases, queues and server architecture.",
  frontend: "React, TypeScript, CSS, browser APIs and performance.",
  databases: "SQL, NoSQL, indexing, transactions and query optimization.",
  "operating-systems":
    "Processes, memory, scheduling, file systems and concurrency.",
  "computer-networks": "TCP/IP, HTTP, DNS, sockets and network security.",
  "system-design":
    "Scalability, distributed systems, caching and architecture patterns.",
};

export default function HomePage() {
  const navTree = getNavTree();
  const recentNotes = getRecentNotes(6);
  const firstTopic = navTree[0]?.topics[0];
  const totalTopics = navTree.reduce(
    (total, category) => total + category.topics.length,
    0,
  );

  return (
    <PageLayout showSidebar={false} showTOC={false}>
      <div className="home-shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="home-hero mb-14">
          <div className="home-hero-copy">
            <p className="home-eyebrow">
              <Sparkles size={13} /> Personal technical library
            </p>
            <h1
              className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5"
              style={{ color: "var(--text-base)" }}
            >
              Learn the system.
              <br />
              <span>Remember the details.</span>
            </h1>
            <p
              className="max-w-xl text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              A focused workspace for turning backend concepts, diagrams, and
              interview questions into durable understanding.
            </p>
            <div className="home-actions">
              {firstTopic && (
                <Link to={firstTopic.path} className="home-primary-action">
                  Start the backend path <ArrowRight size={16} />
                </Link>
              )}
              <Link to="/grindboard" className="home-secondary-action">
                <BarChart3 size={16} /> Practice on Grindboard
              </Link>
            </div>
            <div className="home-stats" aria-label="Library summary">
              <span>
                <strong>{totalTopics}</strong> structured notes
              </span>
              <span>
                <strong>{navTree.length}</strong> learning path
              </span>
              <span>
                <strong>1</strong> place to revise
              </span>
            </div>
          </div>
          <div className="home-hero-orbit" aria-hidden="true">
            <div className="orbit-grid" />
            <div className="orbit-core">
              <BookOpen size={30} />
            </div>
            <span className="orbit-chip chip-one">HTTP</span>
            <span className="orbit-chip chip-two">AUTH</span>
            <span className="orbit-chip chip-three">SYSTEMS</span>
          </div>
        </section>

        {/* ── Category Grid ─────────────────────────────────────────────── */}
        <section className="mb-16" aria-labelledby="categories-heading">
          <h2
            id="categories-heading"
            className="text-xs font-semibold uppercase tracking-widest mb-6 px-1"
            style={{ color: "var(--text-muted)" }}
          >
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navTree.map((cat) => {
              const firstTopic = cat.topics[0];
              const to = firstTopic ? firstTopic.path : `/${cat.categorySlug}`;
              const icon = CATEGORY_ICONS[cat.categorySlug];
              const desc = CATEGORY_DESCRIPTIONS[cat.categorySlug] ?? "";

              return (
                <Link
                  key={cat.categorySlug}
                  to={to}
                  className="category-card group flex flex-col p-5 rounded-xl border border-base
                             transition-all duration-200 hover:border-brand-400
                             dark:hover:border-brand-500 hover:shadow-md
                             hover:shadow-brand-500/10 bg-surface"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg
                                  bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400
                                  transition-colors group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40"
                    >
                      {icon ?? <BookOpen size={20} />}
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border border-base font-medium"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                        backgroundColor: "var(--bg-raised)",
                      }}
                    >
                      {cat.topics.length} topic
                      {cat.topics.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3
                    className="font-semibold text-base mb-1.5 group-hover:text-brand-600
                                dark:group-hover:text-brand-400 transition-colors"
                    style={{ color: "var(--text-base)" }}
                  >
                    {cat.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {desc}
                  </p>
                  {cat.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cat.topics.slice(0, 3).map((t) => (
                        <span
                          key={t.topicSlug}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--bg-raised)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {t.label}
                        </span>
                      ))}
                      {cat.topics.length > 3 && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--bg-raised)",
                            color: "var(--text-subtle)",
                          }}
                        >
                          +{cat.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Recently Added ────────────────────────────────────────────── */}
        {recentNotes.length > 0 && (
          <section aria-labelledby="recent-heading">
            <h2
              id="recent-heading"
              className="text-xs font-semibold uppercase tracking-widest mb-6 px-1"
              style={{ color: "var(--text-muted)" }}
            >
              Recently Added
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.path}
                  to={note.path}
                  className="flex items-center gap-3 p-4 rounded-lg border border-base
                             hover:border-brand-400 dark:hover:border-brand-500
                             transition-colors bg-surface"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-base)" }}
                    >
                      {note.title}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {note.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
