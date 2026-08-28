import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useDemoStore, activeFilterCount } from "@/lib/demo-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { textSummaryToClipboard, visualSummaryToClipboard } from "@/lib/summary-text";
import { MOCK_SUMMARY, VISUAL_SUMMARY, FINAL_INSIGHT, type VisualBar } from "@/lib/mock-summary";
import { ACTIVE_THREAD_ID } from "@/lib/mock-chats";
import { SparkleIcon } from "./SparkleIcon";
import { TODAYS_INSIGHTS } from "./TodaysInsights";
import {
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Pencil,
  Trash2,
  Lock,
  MessageSquare,
  ListFilter,
  Copy,
} from "lucide-react";

const barFill: Record<VisualBar["tone"], string> = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  muted: "bg-muted-foreground/40",
};

function headlineColor(tone: VisualBar["tone"]): string {
  if (tone === "up") return "text-emerald-600";
  if (tone === "down") return "text-red-600";
  return "text-foreground";
}

function MetricBar({ bar }: { bar: VisualBar }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] text-muted-foreground truncate">{bar.label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barFill[bar.tone]}`}
          style={{ width: `${bar.value}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-[11px] font-medium">{bar.display}</span>
    </div>
  );
}

const QUICK_LABELS: Record<string, string> = {
  assigned: "Assigned users",
  tags: "Tags",
  company: "Company name",
  followers: "Followers",
  contactType: "Contact type",
};

function FilterBadge() {
  const { filters } = useDemoStore();
  const count = activeFilterCount(filters);
  const active = count > 0;
  const activeQuick = (Object.keys(filters.quick) as (keyof typeof filters.quick)[]).filter(
    (k) => filters.quick[k],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 gap-1.5 px-2 ${active ? "text-[color:var(--ai-accent)]" : "text-muted-foreground"}`}
          title="This summary reflects the dashboard's date range and quick filters"
        >
          <ListFilter className="h-4 w-4" />
          {active && (
            <span className="rounded-full bg-[color:var(--ai-accent)] px-1.5 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="text-sm font-semibold">Reflects the dashboard's filters</div>
        <p className="mt-1 text-xs text-muted-foreground">
          This summary updates to match the dashboard's date range and quick filters.
        </p>
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date range</span>
            <span className="font-medium">{filters.datePreset}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Range</span>
            <span className="font-medium">
              {filters.from} → {filters.to}
            </span>
          </div>
          {activeQuick.length > 0 ? (
            activeQuick.map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-muted-foreground">{QUICK_LABELS[k]}</span>
                <span className="font-medium">{filters.quick[k]}</span>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No quick filters applied.</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function relativeTime(date: Date | null): string {
  if (!date) return "just now";
  const secs = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs} secs ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function SummaryWidget() {
  const {
    widgetExists,
    role,
    isGenerating,
    regenerate,
    deleteWidget,
    openEditDrawer,
    openAskPanel,
    openAskWithSeed,
    highlightWidget,
    resetSettings,
    lastUpdated,
    settings,
  } = useDemoStore();
  const isVisual = settings.granularity === "widget";
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const copySummary = () => {
    const text = isVisual
      ? visualSummaryToClipboard(settings.title)
      : textSummaryToClipboard(settings.title);
    navigator.clipboard.writeText(text).then(
      () => toast.success("Summary copied to clipboard"),
      () => toast.error("Couldn't copy the summary"),
    );
  };
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Keep the "Last updated … ago" subtitle ticking without a manual refresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const [digDeeper, setDigDeeper] = useState<{
    top: number;
    left: number;
    text: string;
  } | null>(null);

  // Show "Dig deeper" next to selected text inside the widget content
  useEffect(() => {
    const onSelect = () => {
      const sel = window.getSelection();
      const container = contentRef.current;
      if (!sel || sel.isCollapsed || !container) {
        setDigDeeper(null);
        return;
      }
      const range = sel.rangeCount ? sel.getRangeAt(0) : null;
      if (!range || !container.contains(range.commonAncestorContainer)) {
        setDigDeeper(null);
        return;
      }
      const text = sel.toString().trim();
      if (!text) {
        setDigDeeper(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      setDigDeeper({
        top: rect.top - cRect.top - 34,
        left: Math.max(0, rect.left - cRect.left + rect.width / 2 - 50),
        text,
      });
    };
    document.addEventListener("selectionchange", onSelect);
    return () => document.removeEventListener("selectionchange", onSelect);
  }, []);

  if (!widgetExists) return null;

  const isViewer = role === "viewer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: highlightWidget
          ? [
              "0 0 0 0 oklch(0.62 0.20 295 / 0.45)",
              "0 0 0 6px oklch(0.62 0.20 295 / 0.28)",
              "0 0 0 0 oklch(0.62 0.20 295 / 0.45)",
            ]
          : "0 0 0 0 transparent",
      }}
      transition={
        highlightWidget
          ? { boxShadow: { duration: 1.1, repeat: 1 }, duration: 0.4 }
          : { duration: 0.4 }
      }
      className="rounded-xl"
    >
      <Card className="overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundImage: "var(--ai-gradient-soft)" }}
        >
          <div className="flex items-center gap-2.5">
            <SparkleIcon />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">{settings.title}</div>
              <div className="text-[11px] text-muted-foreground">
                Last updated · {relativeTime(lastUpdated)}
              </div>
            </div>
          </div>
          {!isViewer && (
            <div className="flex items-center gap-1">
              <FilterBadge />
              {/* Manual refresh only for scheduled cadences; Live auto-refreshes on filter changes */}
              {(settings.cadence === "daily" || settings.cadence === "weekly") && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => regenerate()}
                  disabled={isGenerating}
                  title={isGenerating ? "Refreshing summary…" : "Refresh summary now"}
                >
                  <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={copySummary}
                title="Copy summary"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openEditDrawer}>
                    <Pencil className="h-4 w-4 mr-2" /> Customize summary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={resetSettings}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset to defaults
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({ to: "/ask-ai", search: { thread: ACTIVE_THREAD_ID } })
                    }
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Open Ask AI chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Reload progress bar — shows on manual refresh and on live filter/date changes */}
        {!isViewer && isGenerating && (
          <div className="h-1 w-full overflow-hidden bg-[color:var(--ai-accent)]/15">
            <motion.div
              className="h-full bg-[color:var(--ai-accent)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          </div>
        )}

        {isViewer ? (
          <div className="p-6 text-center space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">Summary locked for your role</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                You can't see the summary saved by another user, but you can generate your own from
                the data you have access to.
              </p>
            </div>
            <Button size="sm" onClick={openAskPanel} className="gap-2">
              <SparkleIcon className="!h-5 !w-5" />
              Generate your own summary
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3 relative" ref={contentRef}>
            {digDeeper && (
              <button
                className="absolute z-20 flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background shadow-lg hover:opacity-90"
                style={{ top: digDeeper.top, left: digDeeper.left }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  openAskWithSeed(digDeeper.text);
                  setDigDeeper(null);
                  window.getSelection()?.removeAllRanges();
                }}
              >
                <SparkleIcon className="!h-3 !w-3" />
                Dig deeper
              </button>
            )}
            <div
              className={`space-y-3 transition-opacity duration-300 ${
                isGenerating ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <div className="rounded-lg border bg-[color:var(--ai-accent)]/5 p-3 mb-1">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold text-[color:var(--ai-accent)]">
                    Today's insights:{" "}
                  </span>
                  {TODAYS_INSIGHTS}
                </p>
              </div>
              {isVisual ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(expanded ? VISUAL_SUMMARY : VISUAL_SUMMARY.slice(0, 2)).map((m) => (
                      <div key={m.key} className="rounded-lg border bg-muted/20 p-3">
                        <div className="flex items-center gap-2 text-sm font-semibold mb-0.5">
                          <span>{m.emoji}</span>
                          <span className={headlineColor(m.tone)}>{m.headline}</span>
                        </div>
                        <div className="text-[13px] font-medium">{m.metric}</div>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-2.5">{m.note}</p>
                        <div className="space-y-1.5">
                          {m.bars.map((bar, i) => (
                            <MetricBar key={i} bar={bar} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {expanded && (
                    <div className="rounded-lg border bg-[color:var(--ai-accent)]/5 p-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ai-accent)] mb-1">
                        Final insight
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {FINAL_INSIGHT}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  {(expanded ? MOCK_SUMMARY : MOCK_SUMMARY.slice(0, 2)).flatMap((m) =>
                    m.bullets.map((b, i) => (
                      <div key={`${m.key}-${i}`} className="flex gap-2 leading-relaxed">
                        <span className="w-4 shrink-0 select-none text-center">
                          {i === 0 ? m.emoji : "•"}
                        </span>
                        <span>
                          {i === 0 && (
                            <span className="font-semibold text-foreground">{m.label}: </span>
                          )}
                          {b}
                        </span>
                      </div>
                    )),
                  )}
                </div>
              )}
            </div>

            <button
              className="text-xs font-medium text-[color:var(--ai-accent)] hover:underline"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? "Show less" : "Show all modules"}
            </button>
          </div>
        )}
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete summary widget?</AlertDialogTitle>
            <AlertDialogDescription>
              The widget will be removed from this dashboard. The underlying chat thread is kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteWidget}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
