import { ArrowUpRight, BarChart3 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

export default function GrindboardPage() {
  const toolUrl = `${import.meta.env.BASE_URL}tools/grindboard.html`;

  return (
    <PageLayout showSidebar={false} showTOC={false}>
      <section className="flex min-h-[calc(100vh-60px)] flex-col">
        <div
          className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:px-8"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm"
              aria-hidden="true"
            >
              <BarChart3 size={19} />
            </span>
            <div>
              <h1
                className="text-base font-bold"
                style={{ color: "var(--text-base)" }}
              >
                Grindboard
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Company-wise DSA progress tracker
              </p>
            </div>
          </div>
          <a
            href={toolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Open full screen
            <ArrowUpRight size={14} />
          </a>
        </div>

        <iframe
          src={toolUrl}
          title="Grindboard DSA tracker"
          className="min-h-0 flex-1 border-0"
          style={{ minHeight: "calc(100vh - 124px)" }}
        />
      </section>
    </PageLayout>
  );
}
