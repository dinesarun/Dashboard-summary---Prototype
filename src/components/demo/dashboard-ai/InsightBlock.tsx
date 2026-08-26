import { Activity, AlertTriangle, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import type { Insight } from "@/lib/mock-dashboard-ai";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MiniSparkline } from "./MiniSparkline";

const ICONS = {
  performance: Activity,
  trend: TrendingUp,
  anomaly: AlertTriangle,
  action: Sparkles,
} as const;

export function InsightBlock({
  insight,
  dense = false,
  onAction,
}: {
  insight: Insight;
  dense?: boolean;
  onAction?: (question: string) => void;
}) {
  const Icon = ICONS[insight.kind];
  const tone =
    insight.kind === "anomaly"
      ? "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
      : insight.kind === "action"
        ? "text-[color:var(--ai-accent)] bg-[color:var(--ai-accent-soft)]"
        : insight.positive
          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
          : "text-muted-foreground bg-muted";

  return (
    <div className={`rounded-md border bg-card ${dense ? "p-2.5" : "p-3"} space-y-1.5`}>
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded ${tone}`}>
          <Icon className="h-3 w-3" />
        </span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          {insight.label}
        </span>
        {insight.delta && (
          <span className={`ml-auto text-[10px] font-medium ${insight.positive === false ? "text-rose-600" : "text-emerald-600"}`}>
            {insight.delta}
          </span>
        )}
      </div>
      <div className="text-sm font-semibold leading-snug">{insight.headline}</div>
      <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{insight.detail}</div>
      <div className="flex items-center justify-between pt-1">
        <MiniSparkline series={insight.series} positive={insight.positive ?? true} width={120} height={20} />
        <Popover>
          <PopoverTrigger className="text-[11px] text-[color:var(--ai-accent)] hover:underline">
            View chart
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="text-xs font-medium mb-1">{insight.label} · supporting chart</div>
            <div className="text-[11px] text-muted-foreground mb-2">{insight.headline}</div>
            <MiniSparkline
              series={insight.series}
              positive={insight.positive ?? true}
              width={272}
              height={80}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>
      {onAction && insight.actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-1.5">
          {insight.actions.map((a) => (
            <button
              key={a}
              onClick={() => onAction(a)}
              className="inline-flex items-center gap-1 text-[11px] text-[color:var(--ai-accent)] hover:underline"
            >
              {a}
              <ArrowRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
