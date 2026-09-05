import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Search, Sun, Moon, Menu, X, BarChart3 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import SearchModal from "@/components/search/SearchModal";
import Sidebar from "./Sidebar";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigation
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <>
      <header
        className="site-header fixed top-0 left-0 right-0 z-40 h-[60px] flex items-center px-4 lg:px-6
                   border-b border-base bg-surface backdrop-blur-sm"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-base shrink-0 mr-4
                     text-base-color hover:text-brand-600 dark:hover:text-brand-400
                     transition-colors duration-150"
        >
          <span
            className="site-logo flex items-center justify-center w-8 h-8 rounded-lg
                           bg-brand-600 text-white shadow-sm"
          >
            <BookOpen size={16} strokeWidth={2.5} />
          </span>
          <span className="hidden sm:block">
            Mega
            <span className="text-brand-600 dark:text-brand-400">
              {" "}
              Revision
            </span>{" "}
            Notes
          </span>
          <span className="sm:hidden">MRN</span>
        </Link>

        {/* ── Search bar (desktop) ──────────────────────────────────────── */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5
                     text-sm rounded-lg border border-base text-muted-color
                     bg-raised hover:border-brand-400 transition-colors duration-150
                     cursor-text"
          style={{
            backgroundColor: "var(--bg-raised)",
            borderColor: "var(--border)",
          }}
          aria-label="Open search"
        >
          <Search size={14} className="shrink-0" />
          <span>Search notes...</span>
          <kbd
            className="ml-auto text-xs px-1.5 py-0.5 rounded border border-base
                          font-mono hidden lg:inline-block"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-subtle)",
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* ── Spacer ───────────────────────────────────────────────────── */}
        <div className="flex-1" />

        <Link
          to="/grindboard"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-color transition-colors hover:bg-raised hover:text-brand-600 dark:hover:text-brand-400 sm:flex"
          aria-label="Open Grindboard"
        >
          <BarChart3 size={16} />
          Grindboard
        </Link>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-raised transition-colors"
            style={{ "--bg-raised": "var(--bg-raised)" } as React.CSSProperties}
            aria-label="Search"
          >
            <Search size={18} style={{ color: "var(--text-muted)" }} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-raised)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-raised)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="GitHub"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-150"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-raised)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── Mobile sidebar drawer ───────────────────────────────────────── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className="fixed top-[60px] left-0 bottom-0 z-40 w-[280px] overflow-y-auto
                       border-r border-base animate-slide-in lg:hidden"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
          >
            <Sidebar
              currentPath={location.pathname}
              onNavigate={closeMobileMenu}
            />
          </div>
        </>
      )}

      {/* ── Search modal ────────────────────────────────────────────────── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
