import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDemoStore } from "@/lib/demo-store";

// A small, clearly-separated toolbar control for previewing deferred prototype
// concepts. Both toggles are off by default; enable one to analyze, then turn off.
export function PrototypeToggles() {
  const {
    todaysInsightsEnabled,
    summaryAiEnabled,
    refreshFrequencyEnabled,
    setTodaysInsightsEnabled,
    setSummaryAiEnabled,
    setRefreshFrequencyEnabled,
  } = useDemoStore();

  const activeCount =
    (todaysInsightsEnabled ? 1 : 0) +
    (summaryAiEnabled ? 1 : 0) +
    (refreshFrequencyEnabled ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 px-2.5"
          title="Prototype toggles"
          aria-label="Prototype toggles"
        >
          <FlaskConical className="h-4 w-4 text-[color:var(--ai-accent)]" />
          {activeCount > 0 && (
            <span className="rounded-full bg-[color:var(--ai-accent)] px-1.5 text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="text-sm font-semibold">Prototype toggles</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Concepts we haven&apos;t committed to. Off by default — enable to preview and analyze.
        </p>

        <div className="mt-3 space-y-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={todaysInsightsEnabled}
              onCheckedChange={(v) => setTodaysInsightsEnabled(v === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">Today&apos;s insights</span>
              <span className="block text-[11px] text-muted-foreground">
                The insights strip and the &quot;Today&apos;s insights&quot; line in the summary.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={summaryAiEnabled}
              onCheckedChange={(v) => setSummaryAiEnabled(v === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">Summary AI</span>
              <span className="block text-[11px] text-muted-foreground">
                The toolbar button linking to the side-panel concept.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={refreshFrequencyEnabled}
              onCheckedChange={(v) => setRefreshFrequencyEnabled(v === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-medium">Refresh frequency</span>
              <span className="block text-[11px] text-muted-foreground">
                The refresh frequency field in Customize summary.
              </span>
            </span>
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
