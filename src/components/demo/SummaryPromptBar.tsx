import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/demo-store";
import { SparkleIcon } from "./SparkleIcon";

// Trigger-point variant: a slim prompt bar below the Quick Filters that nudges
// the user to summarize the dashboard. Hidden once a summary widget exists.
export function SummaryPromptBar() {
  const { summaryPromptBarEnabled, widgetExists, openAskPanel } = useDemoStore();

  if (!summaryPromptBarEnabled || widgetExists) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5"
      style={{ backgroundImage: "var(--ai-gradient-soft)" }}
    >
      <div className="flex items-center gap-2.5">
        <SparkleIcon />
        <div className="leading-tight">
          <div className="text-sm font-medium">Summarize this dashboard with AI</div>
          <div className="text-[11px] text-muted-foreground">
            See what changed and what needs attention.
          </div>
        </div>
      </div>
      <Button size="sm" onClick={openAskPanel} className="shrink-0 gap-1.5">
        Summarize
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
