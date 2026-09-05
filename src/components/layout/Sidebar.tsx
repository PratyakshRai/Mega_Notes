import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getNavTree } from "@/lib/content";
import type { NavTopic } from "@/types";

interface SidebarProps {
  currentPath: string;
  onNavigate?: () => void;
}

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const navTree = getNavTree();

  // Track which categories are open
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    // By default, open the category of the current page
    const initial = new Set<string>();
    for (const cat of navTree) {
      if (cat.topics.some((t) => t.path === currentPath)) {
        initial.add(cat.categorySlug);
      }
    }
    // If no match, open all categories
    if (initial.size === 0) {
      for (const cat of navTree) initial.add(cat.categorySlug);
    }
    return initial;
  });
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const category of navTree) {
      for (const topic of category.topics) {
        if (topic.path !== currentPath || !topic.groupPath) continue;
        const parts = topic.groupPath.split(" / ");
        for (let index = 1; index <= parts.length; index += 1) {
          initial.add(
            `${category.categorySlug}:${parts.slice(0, index).join(" / ")}`,
          );
        }
      }
    }
    return initial;
  });

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <nav className="py-4 px-3" aria-label="Documentation navigation">
      {navTree.map((category) => {
        const isOpen = openCategories.has(category.categorySlug);
        const hasActive = category.topics.some((t) => t.path === currentPath);
        const topicGroups = category.topics.reduce((groups, topic) => {
          const group = topic.groupPath ?? "";
          if (!groups.has(group)) groups.set(group, []);
          groups.get(group)!.push(topic);
          return groups;
        }, new Map<string, NavTopic[]>());

        const renderTopics = (topics: NavTopic[]) => (
          <ul className="space-y-0.5" role="list">
            {topics.map((topic) => {
              const isActive = topic.path === currentPath;
              return (
                <li key={topic.topicSlug}>
                  <Link
                    to={topic.path}
                    onClick={onNavigate}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm
                                transition-colors duration-100
                                ${isActive ? "sidebar-link-active" : "hover:bg-raised"}`}
                    style={
                      !isActive ? { color: "var(--text-base)" } : undefined
                    }
                    aria-current={isActive ? "page" : undefined}
                  >
                    {topic.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        );

        const renderFolder = (
          parts: string[],
          topics: NavTopic[],
          parentPath = "",
        ): ReactNode => {
          const folderPath = parentPath
            ? `${parentPath} / ${parts[0]}`
            : parts[0];
          const groupKey = `${category.categorySlug}:${folderPath}`;
          const folderIsOpen = openGroups.has(groupKey);

          return (
            <li key={folderPath}>
              <button
                type="button"
                onClick={() => toggleGroup(groupKey)}
                className="w-full flex items-center gap-1.5 rounded-md px-3 py-1.5
                           text-left text-[10px] font-semibold uppercase tracking-widest
                           text-muted-color transition-colors hover:bg-raised"
                style={{
                  paddingLeft: `${12 + parentPath.split(" / ").filter(Boolean).length * 10}px`,
                }}
                aria-expanded={folderIsOpen}
              >
                {folderIsOpen ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                <span>{parts[0]}</span>
              </button>
              {folderIsOpen && (
                <ul className="space-y-0.5" role="list">
                  {parts.length > 1
                    ? renderFolder(parts.slice(1), topics, folderPath)
                    : renderTopics(topics)}
                </ul>
              )}
            </li>
          );
        };

        return (
          <div key={category.categorySlug} className="mb-1">
            {/* ── Category header ──────────────────────────────────── */}
            <button
              onClick={() => toggleCategory(category.categorySlug)}
              className="w-full flex items-center justify-between px-2 py-1.5
                         rounded-md text-xs font-semibold uppercase tracking-wider
                         transition-colors duration-150 hover:bg-raised"
              style={{
                color: hasActive ? "#3b72f6" : "var(--text-muted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-raised)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              aria-expanded={isOpen}
            >
              <span>{category.label}</span>
              {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>

            {/* ── Topics list ──────────────────────────────────────── */}
            {isOpen && (
              <ul className="mt-1 ml-1 space-y-2" role="list">
                {Array.from(topicGroups).map(([group, topics]) =>
                  group ? (
                    renderFolder(group.split(" / "), topics)
                  ) : (
                    <li key="root-topics">{renderTopics(topics)}</li>
                  ),
                )}
              </ul>
            )}
          </div>
        );
      })}

      {/* Bottom padding */}
      <div className="h-8" />
    </nav>
  );
}
