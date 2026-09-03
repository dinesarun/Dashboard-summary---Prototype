import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardHeader } from "@/components/demo/DashboardHeader";
import { MockDashboardGrid } from "@/components/demo/MockDashboardGrid";
import { SummaryWidget } from "@/components/demo/SummaryWidget";
import { AskAIPanel } from "@/components/demo/AskAIPanel";
import { AskAIExpandedDialog } from "@/components/demo/AskAIExpandedDialog";
import { AddWidgetPanel } from "@/components/demo/AddWidgetPanel";
import { EditSummaryDrawer } from "@/components/demo/EditSummaryDrawer";
import { CustomReportingView } from "@/components/demo/CustomReportingView";
import { TodaysInsights } from "@/components/demo/TodaysInsights";
import { QuickFiltersBar } from "@/components/demo/DashboardFilters";
import { SummaryPromptBar } from "@/components/demo/SummaryPromptBar";

import { useDemoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dashboard Summary AI — Demo" },
      {
        name: "description",
        content: "Working demo of the persistent Dashboard Summary AI widget for HighLevel.",
      },
    ],
  }),
});

function Index() {
  const { view, editMode, openAddWidget, widgetExists } = useDemoStore();

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />

      {view === "report" ? (
        <CustomReportingView />
      ) : (
        <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
          <div className="rounded-lg border bg-card/60 px-4 py-2.5">
            <QuickFiltersBar />
          </div>

          <SummaryPromptBar />

          <TodaysInsights />

          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-between rounded-md border-2 border-dashed border-foreground/40 bg-background px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">
                  Edit mode — drag widgets to rearrange.
                </span>
                <Button size="sm" onClick={openAddWidget} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Add widget
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {widgetExists && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SummaryWidget />
              </motion.div>
            )}
          </AnimatePresence>

          <MockDashboardGrid />

          <footer className="pt-6 pb-10 text-[11px] text-muted-foreground text-center">
            Demo prototype · Dashboard Summary AI · Mocked data, no backend
          </footer>
        </main>
      )}

      <AskAIPanel />
      <AskAIExpandedDialog />
      <AddWidgetPanel />
      <EditSummaryDrawer />
      <Toaster />
    </div>
  );
}
