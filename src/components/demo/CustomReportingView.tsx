import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/demo-store";
import { MOCK_REPORT_PAGES, REPORT_META } from "@/lib/mock-report";
import { Card } from "@/components/ui/card";
import { SparkleIcon } from "./SparkleIcon";
import { ReportPage } from "./ReportPage";
import { ReportAddWidgetPanel } from "./ReportAddWidgetPanel";
import { ReportSummaryWidget } from "./ReportSummaryWidget";
import {
  ChevronLeft,
  Download,
  Send,
  Pencil,
  Calendar,
  SlidersHorizontal,
  Lock,
  FileText,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function CustomReportingView() {
  const { editMode, setEditMode, report, openAskPanel } = useDemoStore();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      {/* Toolbar */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-6 py-2.5">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={() => toast("Back — not in demo scope")}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">DK – General Widgets</span>
            <button className="text-muted-foreground hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="outline">
              Save
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="h-3.5 w-3.5" /> Send or Schedule
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-2 border-t">
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={editMode && panelOpen ? "default" : "ghost"}
              onClick={() => {
                if (!editMode) setEditMode(true);
                setPanelOpen((p) => !p);
              }}
              className="h-8 w-8 p-0"
              title="Add widget"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Lock className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 h-8">
            <Calendar className="h-3.5 w-3.5" /> This Quarter
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ x: -380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -380, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[380px] shrink-0 border-r bg-background overflow-hidden"
            >
              <ReportAddWidgetPanel onClose={() => setPanelOpen(false)} />
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto bg-muted/40 px-6 py-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {!report.exists && editMode && (
              <div
                className="flex items-center justify-between rounded-xl border-2 border-dashed p-4"
                style={{ borderColor: "oklch(0.55 0.19 295 / 0.3)" }}
              >
                <div className="text-sm text-muted-foreground">
                  Edit mode — open <strong>Add Widget</strong> and pick{" "}
                  <strong>AI Insights → Report Summary AI</strong>.
                </div>
                <Button size="sm" onClick={openAskPanel} className="gap-1.5">
                  Or generate via Ask AI
                </Button>
              </div>
            )}

            {/* Title / cover page */}
            <Card className="overflow-hidden shadow-sm">
              <div
                className="px-10 py-12 space-y-6"
                style={{ backgroundImage: "var(--ai-gradient-soft)" }}
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Report
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight">{REPORT_META.title}</h1>
                  <div className="text-sm text-muted-foreground">
                    {REPORT_META.dateRange} · Prepared for {REPORT_META.preparedFor}
                  </div>
                </div>
                {report.exists && (
                  <div className="rounded-lg border bg-background/70 backdrop-blur p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--ai-accent)]">
                      <SparkleIcon className="!h-5 !w-5" /> Executive highlights
                    </div>
                    <ul className="text-sm space-y-1.5 text-foreground/90 list-disc pl-5">
                      {REPORT_META.executiveHighlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t">
                  <span>{REPORT_META.title}</span>
                  <span>Page 1 · Title</span>
                </div>
              </div>
            </Card>

            {/* Report summary as its own full page (page 2) */}
            {report.exists && (
              <Card className="overflow-hidden shadow-sm">
                <div className="bg-card px-8 pt-8 pb-6 space-y-6">
                  <ReportSummaryWidget />
                  <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t">
                    <span>{REPORT_META.title}</span>
                    <span>{REPORT_META.dateRange} · Page 2 · Report summary</span>
                  </div>
                </div>
              </Card>
            )}

            {MOCK_REPORT_PAGES.map((p, i) => (
              <ReportPage
                key={p.id}
                page={p}
                pageNumber={i + (report.exists ? 3 : 2)}
                editMode={editMode}
                onAddBelow={() => {
                  setPanelOpen(true);
                  if (!editMode) setEditMode(true);
                }}
              />
            ))}

            <div className="text-center text-[11px] text-muted-foreground pt-4 pb-8">
              End of report · {MOCK_REPORT_PAGES.length + (report.exists ? 2 : 1)} pages
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

