import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/demo-store";
import { SparkleIcon } from "./SparkleIcon";
import { ViewSwitcher } from "./ViewSwitcher";
import { DateRangeFilter } from "./DashboardFilters";
import { PrototypeToggles } from "./PrototypeToggles";
import { Pencil, X } from "lucide-react";

export function DashboardHeader() {
  const { editMode, setEditMode, view, openAskPanel, summaryAiEnabled } = useDemoStore();
  const isReport = view === "report";

  return (
    <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
            HL
          </div>
          <ViewSwitcher />
        </div>

        <div className="flex items-center gap-2">
          <PrototypeToggles />

          {!isReport && <DateRangeFilter />}

          <Button
            size="sm"
            variant="outline"
            onClick={openAskPanel}
            className="h-8 w-8 px-0"
            aria-label="Ask AI"
            title="Ask AI"
          >
            <SparkleIcon className="!h-4 !w-4" />
          </Button>

          {summaryAiEnabled && (
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link to="/dashboard-ai">
                <SparkleIcon className="!h-4 !w-4" /> Summary AI
              </Link>
            </Button>
          )}

          <div className="mx-2 h-6 w-px bg-border" />

          {editMode ? (
            <Button
              size="sm"
              variant="default"
              onClick={() => setEditMode(false)}
              className="gap-1"
            >
              <X className="h-4 w-4" /> Done editing
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="gap-1">
              <Pencil className="h-4 w-4" /> {isReport ? "Edit report" : "Edit dashboard"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
