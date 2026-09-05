import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  code: string;
}

let mermaidLoaded = false;
let mermaidInstance: typeof import("mermaid").default | null = null;

async function getMermaid() {
  if (mermaidInstance) return mermaidInstance;
  const mod = await import("mermaid");
  mermaidInstance = mod.default;
  if (!mermaidLoaded) {
    mermaidInstance.initialize({
      startOnLoad: false,
      theme: "neutral",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: 16,
      flowchart: {
        htmlLabels: true,
        useMaxWidth: false,
        nodeSpacing: 42,
        rankSpacing: 52,
      },
      securityLevel: "loose",
    });
    mermaidLoaded = true;
  }
  return mermaidInstance;
}

let diagramId = 0;

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const idRef = useRef(`mrn-mermaid-${++diagramId}`);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setLoading(true);
      setError(null);

      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(idRef.current, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Diagram render error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    return (
      <div className="mermaid-container">
        <p className="text-sm text-red-500 dark:text-red-400 font-mono">
          Diagram error: {error}
        </p>
        <pre
          className="mt-2 text-xs text-left overflow-x-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div className="mermaid-container">
      {loading && (
        <div
          className="flex items-center justify-center py-8 gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Rendering diagram…</span>
        </div>
      )}
      <div ref={containerRef} className={loading ? "hidden" : ""} />
    </div>
  );
}
