import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/lib/demo-store";
import { SparkleIcon } from "./SparkleIcon";
import {
  Search,
  Hash,
  PieChart,
  LineChart,
  BarChart3,
  AlignLeft,
  Table,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CATEGORIES = [
  { label: "Contacts", count: 17 },
  { label: "Appointments", count: 15 },
  { label: "Opportunities", count: 17 },
  { label: "Visitor Data", count: 13 },
  { label: "Emails", count: 11 },
  { label: "Calls", count: 13 },
  { label: "Conversations", count: 12 },
  { label: "Payments", count: 17 },
];

const TABS = ["Widgets", "Elements", "Themes", "Custom"];

export function ReportAddWidgetPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("Widgets");
  const { openAskPanel, report } = useDemoStore();

  return (
    <div className="flex h-full">
      {/* left tabs */}
      <div className="w-20 border-r bg-muted/30 flex flex-col items-stretch text-[11px]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-2 py-3 text-center transition ${
              tab === t
                ? "bg-background text-[color:var(--ai-accent)] font-medium border-r-2 border-[color:var(--ai-accent)] -mr-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "Custom" ? "Custom M…" : t}
          </button>
        ))}
      </div>

      {/* panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-semibold">Add Widget</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3 overflow-y-auto flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search Widget" className="pl-8 h-9" />
          </div>

          <div>
            <div className="text-[11px] text-muted-foreground mb-1.5">Chart type</div>
            <div className="grid grid-cols-5 gap-1.5">
              {[Hash, PieChart, LineChart, BarChart3, AlignLeft, Table].map((Icon, i) => (
                <button
                  key={i}
                  className={`flex h-8 items-center justify-center rounded-md border ${
                    i === 0
                      ? "bg-[color:var(--ai-accent-soft)] border-[color:var(--ai-accent)]/30 text-[color:var(--ai-accent)]"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Insights – the new section */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              AI Insights
            </div>
            <button
              onClick={() => {
                if (report.exists) {
                  toast("Report summary already on this report");
                  onClose();
                  return;
                }
                openAskPanel();
                onClose();
              }}
              className="w-full flex items-center justify-between gap-3 rounded-lg border-2 p-3 text-left hover:bg-[color:var(--ai-accent-soft)] transition group"
              style={{ borderColor: "oklch(0.55 0.19 295 / 0.25)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <SparkleIcon className="!h-9 !w-9 [&_svg]:!h-4 [&_svg]:!w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Report Summary AI</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Page-grouped AI summary of this report
                  </div>
                </div>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--ai-accent)]" />
            </button>
          </div>

          {/* categories */}
          <div className="space-y-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                onClick={() => toast(`${c.label} widget — not in demo scope`)}
                className="w-full flex items-center justify-between rounded-md px-3 py-3 text-left hover:bg-muted transition border"
              >
                <span className="flex items-center gap-2 text-sm">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  {c.label}
                </span>
                <span className="text-[11px] rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 px-2 py-0.5 tabular-nums">
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t p-3 flex justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
