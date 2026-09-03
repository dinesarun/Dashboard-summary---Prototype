import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/demo-store";
import { SparkleIcon } from "./SparkleIcon";
import { ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

export const TODAYS_INSIGHTS =
  "32 new opportunities came in today (+18% vs. yesterday) with $148K sitting in Proposal — 6 deals have stalled over 7 days. Your no-show rate climbed to 25.5%, mostly from this morning's appointment block.";

export function TodaysInsights() {
  const { openAskPanel, insightsDismissed, dismissInsights, widgetExists, todaysInsightsEnabled } =
    useDemoStore();

  if (!todaysInsightsEnabled || insightsDismissed || widgetExists) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label="Today's insights"
      exit={{ opacity: 0, y: -6 }}
      className="relative rounded-lg border bg-background p-3.5 sm:p-4"
    >
      <button
        type="button"
        onClick={dismissInsights}
        aria-label="Dismiss today's insights"
        title="Dismiss"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted transition"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col gap-3 pr-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-2.5">
          <SparkleIcon className="mt-0.5 shrink-0" />
          <div>
            <h2 className="text-sm font-semibold leading-none">Today&apos;s insights</h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {TODAYS_INSIGHTS}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={openAskPanel}
          className="shrink-0 gap-1.5 border-[color:var(--ai-accent)]/30 text-[color:var(--ai-accent)] hover:bg-[color:var(--ai-accent-soft)]"
        >
          View full summary
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.section>
  );
}
