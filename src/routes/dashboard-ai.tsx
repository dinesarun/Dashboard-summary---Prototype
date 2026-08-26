import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LayoutPanelTop, PanelRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MockReportCanvas } from "@/components/demo/dashboard-ai/MockReportCanvas";
import { EmbeddedInsightStrip } from "@/components/demo/dashboard-ai/EmbeddedInsightStrip";
import { SideInsightPanel } from "@/components/demo/dashboard-ai/SideInsightPanel";
import { SparkleIcon } from "@/components/demo/SparkleIcon";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/dashboard-ai")({
  component: DashboardAIPage,
  head: () => ({
    meta: [
      { title: "Summary AI — Module-native concept exploration" },
      {
        name: "description",
        content:
          "Two PM-ready concepts for an embedded, module-native AI experience inside the Dashboard / Reporting module.",
      },
    ],
  }),
});

type Concept = "embedded" | "side";

function DashboardAIPage() {
  const [concept, setConcept] = useState<Concept>("side");
  const [panelOpen, setPanelOpen] = useState(true);
  const [pinned, setPinned] = useState(true);

  return (
    <TooltipProvider delayDuration={200}>
    <div className="min-h-screen bg-muted/30">
      {/* Mockup chrome — meta header */}
      <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="ghost" className="gap-1.5 -ml-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <SparkleIcon />
              <div>
                <div className="text-sm font-semibold leading-tight">Summary AI</div>
                <div className="text-[11px] text-muted-foreground">
                  Module-native concept exploration · separate from org-wide Ask AI
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-md border bg-background p-0.5 text-xs">
            <button
              onClick={() => setConcept("embedded")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 transition ${
                concept === "embedded" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              <LayoutPanelTop className="h-3.5 w-3.5" /> Concept A · Embedded
            </button>
            <button
              onClick={() => setConcept("side")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 transition ${
                concept === "side" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              <PanelRight className="h-3.5 w-3.5" /> Concept B · Side panel
            </button>
          </div>
        </div>

        {/* Rationale strip */}
        <div className="border-t bg-background">
          <div className="mx-auto max-w-[1400px] px-6 py-2 flex items-center gap-3">
            <Badge variant="outline" className="text-[10px] shrink-0">
              Rationale
            </Badge>
            <AnimatePresence mode="wait">
              <motion.p
                key={concept}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                className="text-xs text-muted-foreground truncate"

              >
                {concept === "embedded"
                  ? "Highest discoverability — insights are visible the moment the dashboard loads. Best when AI summary is the primary lens on the report and execs scan top-down."
                  : "Preserves dashboard real estate. Best when users primarily explore charts and want AI as an on-demand companion. Collapsible rail keeps the report front-and-center."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mock product surface: simulated nav + canvas */}
      <main
        className={`mx-auto max-w-[1400px] px-6 py-5 ${
          concept === "side" ? "flex flex-col h-[calc(100vh-6.5rem)]" : ""
        }`}
      >
        {/* Faux module sub-header to make this feel inside reporting */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Reporting</div>
            <h1 className="text-xl font-semibold tracking-tight">Q3 performance dashboard</h1>
            <div className="text-xs text-muted-foreground">
              Last 7 days · all locations · auto-refresh
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">Filters</Button>
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </div>

        {concept === "embedded" ? (
          <div className="space-y-4">
            <EmbeddedInsightStrip />
            <MockReportCanvas />
            <footer className="pt-8 pb-10 text-[11px] text-muted-foreground text-center">
              Mockup · Summary AI · concept exploration · mocked data
            </footer>
          </div>
        ) : (
          <div className="flex gap-4 items-stretch flex-1 min-h-0 pb-2">
            <div
              className="flex-1 min-w-0 overflow-y-auto pr-1"
              onScroll={() => {
                if (!pinned && panelOpen) setPanelOpen(false);
              }}
            >
              <MockReportCanvas />
            </div>
            <SideInsightPanel
              open={panelOpen}
              onOpenChange={setPanelOpen}
              pinned={pinned}
              onPinnedChange={setPinned}
            />
          </div>
        )}
      </main>
    </div>
    </TooltipProvider>
  );
}
