import { Card } from "@/components/ui/card";
import type { ReportPageDef } from "@/lib/mock-report";
import { MoreHorizontal, Plus } from "lucide-react";

function MiniScore() {
  return (
    <div className="flex items-center gap-6">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(0.93 0.01 255)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="oklch(0.55 0.19 260)"
            strokeWidth="3"
            strokeDasharray="64 100"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">64</span>
          <span className="text-[10px] text-muted-foreground">Score</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 text-xs">
        {[
          { l: "Deliveries", v: "99.49%", up: true, d: "0.7%", rec: "> 95%" },
          { l: "Open rate", v: "23.56%", up: false, d: "8.3%", rec: "> 33%" },
          { l: "Click rate", v: "3.20%", up: false, d: "1.1%", rec: "> 5%" },
        ].map((r) => (
          <div key={r.l} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3">
            <span className="text-muted-foreground">{r.l}</span>
            <span className="font-medium tabular-nums">{r.v}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] ${
                r.up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {r.up ? "↑" : "↓"} {r.d}
            </span>
            <span className="text-muted-foreground tabular-nums">{r.rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniKpis() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="text-5xl font-semibold">4.01K</div>
      <div className="mt-2 inline-flex items-center gap-1.5 text-xs">
        <span className="rounded bg-rose-50 text-rose-700 px-1.5 py-0.5">↓ 43.69%</span>
        <span className="text-muted-foreground">vs Yesterday</span>
      </div>
    </div>
  );
}

function MiniBar() {
  const data = [
    { l: "New", v: 60 },
    { l: "Qualified", v: 82 },
    { l: "Proposal", v: 48 },
    { l: "Won", v: 30 },
    { l: "Lost", v: 18 },
  ];
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="flex items-end gap-3 h-32 pt-2">
      {data.map((d) => (
        <div key={d.l} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t"
            style={{
              height: `${(d.v / max) * 100}%`,
              backgroundImage: "var(--ai-gradient)",
            }}
          />
          <span className="text-[10px] text-muted-foreground">{d.l}</span>
        </div>
      ))}
    </div>
  );
}

function MiniDonut() {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(0.93 0.01 255)" strokeWidth="5" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(0.55 0.19 295)" strokeWidth="5" strokeDasharray="44 100" />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke="oklch(0.68 0.17 330)"
          strokeWidth="5"
          strokeDasharray="28 100"
          strokeDashoffset="-44"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke="oklch(0.7 0.15 200)"
          strokeWidth="5"
          strokeDasharray="28 100"
          strokeDashoffset="-72"
        />
      </svg>
      <div className="space-y-1.5 text-xs">
        {[
          { l: "Phone", v: "44%", c: "oklch(0.55 0.19 295)" },
          { l: "SMS", v: "28%", c: "oklch(0.68 0.17 330)" },
          { l: "Email", v: "28%", c: "oklch(0.7 0.15 200)" },
        ].map((r) => (
          <div key={r.l} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm" style={{ background: r.c }} />
            <span className="text-muted-foreground w-12">{r.l}</span>
            <span className="font-medium tabular-nums">{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetBody({ kind }: { kind: ReportPageDef["widgets"][number]["kind"] }) {
  switch (kind) {
    case "score":
      return <MiniScore />;
    case "kpis":
      return <MiniKpis />;
    case "bar":
      return <MiniBar />;
    case "donut":
      return <MiniDonut />;
  }
}

export function ReportPage({
  page,
  pageNumber,
  editMode,
  onAddBelow,
  children,
}: {
  page: ReportPageDef;
  pageNumber: number;
  editMode: boolean;
  onAddBelow?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <Card className="overflow-hidden shadow-sm">
        <div className="bg-card px-8 pt-8 pb-6 space-y-6">
          {children}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.widgets.map((w, i) => (
              <div
                key={i}
                className="rounded-lg border bg-background p-4 group relative"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold">{w.title}</div>
                    {w.subtitle && (
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {w.subtitle}
                      </div>
                    )}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <WidgetBody kind={w.kind} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t">
            <span>DK – General Widgets</span>
            <span>
              {page.dateRange} · Page {pageNumber}
            </span>
          </div>
        </div>
      </Card>

      {editMode && (
        <div className="flex items-center justify-center py-2 group relative">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <button
            onClick={onAddBelow}
            className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-[color:var(--ai-accent)] hover:border-[color:var(--ai-accent)] transition"
            title="Add widget below"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
