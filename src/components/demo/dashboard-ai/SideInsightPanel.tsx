import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Pin,
  PinOff,
  X,
  Target,
  Share2,
  LayoutGrid,
  FileDown,
  ArrowRight,
} from "lucide-react";
import {
  INSIGHTS,
  TLDR,
  GOAL_PRESETS,
  CANNED_ANSWERS,
  REFINE_FORMAT,
  REFINE_FOCUS,
  EXPLORE_LINKS,
} from "@/lib/mock-dashboard-ai";

import { SparkleIcon } from "../SparkleIcon";
import { InsightBlock } from "./InsightBlock";
import { InlineAskBar, type AskBarHandle, type QA } from "./InlineAskBar";
import { Skeleton } from "@/components/ui/skeleton";

function relative(from: number, now: number) {
  const mins = Math.floor((now - from) / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1m ago";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  return `${h}h ago`;
}

export function SideInsightPanel({
  open,
  onOpenChange,
  pinned,
  onPinnedChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pinned: boolean;
  onPinnedChange: (v: boolean) => void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [goal, setGoal] = useState<string | null>(null);
  const [preset, setPreset] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [generatedAt, setGeneratedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [refinement, setRefinement] = useState<QA | null>(null);
  const [refining, setRefining] = useState(false);
  const askRef = useRef<AskBarHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tldr: true,
    performance: true,
    trend: false,
    anomaly: true,
    action: false,
  });

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 20000);
    return () => clearInterval(id);
  }, []);

  const runGeneration = () => {
    setRefreshing(true);
    setRefinement(null);
    setTimeout(() => {
      setRefreshing(false);
      setGeneratedAt(Date.now());
      setNow(Date.now());
    }, 900);
  };

  const refresh = () => {
    runGeneration();
    toast.success("Regenerating summary", { description: `Goal: ${goal}` });
  };

  const generate = () => {
    const chosen = (custom.trim() || preset || "").trim();
    if (!chosen) return;
    setGoal(chosen);
    runGeneration();
  };

  const changeGoal = () => {
    setGoal(null);
    setRefinement(null);
    setGeneratedAt(null);
  };

  const ask = (q: string) => {
    setRefining(true);
    setOpenSections((s) => ({ ...s, tldr: true }));
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setRefinement({ q, a: CANNED_ANSWERS[q] ?? CANNED_ANSWERS.default });
      setRefining(false);
      setGeneratedAt(Date.now());
      setNow(Date.now());
    }, 700);
  };

  const toggle = (k: string) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  if (!open) {
    return (
      <button
        onClick={() => onOpenChange(true)}
        className="w-12 shrink-0 border rounded-lg bg-card flex flex-col items-center py-3 gap-2 hover:border-[color:var(--ai-accent)]/40 transition"
      >
        <SparkleIcon />
        <div className="[writing-mode:vertical-rl] rotate-180 text-xs font-medium text-foreground/80 mt-1">
          Summary AI
        </div>
        <Badge
          className="text-[10px] mt-auto"
          style={{ backgroundImage: "var(--ai-gradient)", color: "white" }}
        >
          3 new
        </Badge>
      </button>
    );
  }

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 380, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="shrink-0 border rounded-lg bg-card flex flex-col overflow-hidden h-full max-h-full"
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-2.5 border-b"
        style={{ backgroundImage: "var(--ai-gradient-soft)" }}
      >
        <div className="flex items-center gap-2">
          <SparkleIcon />
          <div>
            <div className="text-sm font-semibold leading-tight">Summary AI</div>
            <div className="text-[10px] text-muted-foreground">
              {generatedAt
                ? `3 insights · ${relative(generatedAt, now)}`
                : goal
                  ? "Generating…"
                  : "Set a goal to get started"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {goal && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={refresh}>
                  <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[11px]">
                Regenerate against the current goal
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className={`h-7 w-7 p-0 ${pinned ? "text-[color:var(--ai-accent)]" : ""}`}
                onClick={() => {
                  onPinnedChange(!pinned);
                  toast(pinned ? "Panel unpinned" : "Panel pinned", {
                    description: pinned
                      ? "It will collapse to the rail while you scroll the report."
                      : "It stays open while you work in this module.",
                  });
                }}
              >
                {pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[11px] max-w-[200px]">
              {pinned
                ? "Pinned — stays open. Unpin to collapse it while scrolling."
                : "Pin to keep the panel open while you scroll the report."}
            </TooltipContent>
          </Tooltip>
          {!pinned && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[11px] max-w-[200px]">
                Collapse to the rail — your goal and summary are kept
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {!goal ? (
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-start gap-2 mb-3">
            <Target className="h-4 w-4 mt-0.5 text-[color:var(--ai-accent)]" />
            <div>
              <div className="text-sm font-medium leading-tight">
                What do you want this summary to focus on?
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Pick a starting point or describe your own goal.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            {GOAL_PRESETS.map((g) => {
              const active = preset === g && !custom.trim();
              return (
                <button
                  key={g}
                  onClick={() => {
                    setPreset(g);
                    setCustom("");
                  }}
                  className={`w-full text-left text-xs rounded-md border px-2.5 py-2 transition ${
                    active
                      ? "border-[color:var(--ai-accent)] bg-[color:var(--ai-accent)]/8 font-medium"
                      : "bg-background hover:border-[color:var(--ai-accent)]/40"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <Textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Or describe your goal…"
              className="min-h-[68px] text-xs resize-none"
            />
          </div>

          <Button
            className="w-full mt-3 gap-1.5"
            disabled={!custom.trim() && !preset}
            onClick={generate}
            style={
              custom.trim() || preset
                ? { backgroundImage: "var(--ai-gradient)", color: "white" }
                : undefined
            }
          >
            <SparkleIcon /> Generate summary
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-background/60">
            <Badge variant="outline" className="text-[10px] font-normal max-w-[250px] truncate">
              Goal: {goal}
            </Badge>
            <button
              onClick={changeGoal}
              className="text-[10px] text-[color:var(--ai-accent)] hover:underline ml-auto shrink-0"
            >
              Change
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {refreshing ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : (
              <>
                <Section
                  id="tldr"
                  title="Summary"
                  open={openSections.tldr}
                  onToggle={() => toggle("tldr")}
                >
                  {refining ? (
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-3 w-3/5" />
                    </div>
                  ) : refinement ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          className="text-[10px] font-normal"
                          style={{ backgroundImage: "var(--ai-gradient)", color: "white" }}
                        >
                          Updated for your follow-up
                        </Badge>
                        <button
                          onClick={() => setRefinement(null)}
                          className="text-[10px] text-muted-foreground hover:text-foreground ml-auto"
                        >
                          Reset
                        </button>
                      </div>
                      <p className="text-[11px] italic text-muted-foreground">“{refinement.q}”</p>
                      <p className="text-xs text-foreground/85 leading-relaxed">{refinement.a}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed border-t pt-2">
                        {TLDR}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground/85 leading-relaxed">{TLDR}</p>
                  )}
                </Section>

                {INSIGHTS.map((i) => (
                  <Section
                    key={i.kind}
                    id={i.kind}
                    title={i.label}
                    badge={i.delta}
                    badgePositive={i.positive}
                    open={!!openSections[i.kind]}
                    onToggle={() => toggle(i.kind)}
                  >
                    <InsightBlock insight={i} dense onAction={ask} />
                  </Section>
                ))}

                <div className="rounded-md border bg-background p-3 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <SparkleIcon className="!h-4 !w-4" />
                      <div className="text-[11px] font-semibold text-foreground">
                        Refine this summary
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <RefineRow label="Format:" options={REFINE_FORMAT} onSelect={ask} />
                      <RefineRow label="Focus on:" options={REFINE_FOCUS} onSelect={ask} />
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="text-[11px] font-semibold text-foreground">Explore further</div>
                    <div className="mt-1.5 flex flex-col items-start gap-1">
                      {EXPLORE_LINKS.slice(0, 4).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => ask(s)}
                          className="group inline-flex items-center gap-1.5 text-[12px] text-foreground/80 hover:text-foreground transition text-left"
                        >
                          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                          <span className="underline-offset-2 group-hover:underline">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>


                <div className="rounded-md border p-2.5" style={{ backgroundImage: "var(--ai-gradient-soft)" }}>
                  <Button
                    className="w-full gap-1.5"
                    style={{ backgroundImage: "var(--ai-gradient)", color: "white" }}
                    onClick={() =>
                      toast.success("Added this summary as a dashboard widget", {
                        description: "It will refresh on the widget's schedule.",
                      })
                    }
                  >
                    <LayoutGrid className="h-4 w-4" /> Add summary to dashboard
                  </Button>
                  <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                    <NextChip
                      icon={Share2}
                      label="Share summary"
                      onClick={() =>
                        toast.success("Summary link copied", {
                          description: "Anyone with dashboard access can view it.",
                        })
                      }
                    />
                    <NextChip
                      icon={FileDown}
                      label="Export to PDF"
                      onClick={() =>
                        toast.success("Export queued", {
                          description: "The PDF will download once generated.",
                        })
                      }
                    />
                    <NextChip icon={Target} label="Change goal" onClick={changeGoal} />
                  </div>
                </div>

              </>
            )}
          </div>

          <div className="border-t p-2.5 bg-background/60">
            <InlineAskBar
              ref={askRef}
              compact
              history={[]}
              onAsk={ask}
              showSuggestions={false}
              busy={refining}
            />
          </div>
        </>
      )}
    </motion.aside>
  );
}

function NextChip({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-foreground/80 hover:text-foreground hover:border-[color:var(--ai-accent)]/40 hover:bg-[color:var(--ai-accent-soft)] transition"
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function RefineRow({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-muted-foreground font-medium w-[62px] shrink-0">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onSelect(o)}
          className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] text-foreground/80 hover:text-foreground hover:border-[color:var(--ai-accent)]/40 hover:bg-[color:var(--ai-accent-soft)] transition"
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
  badge,
  badgePositive,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  badgePositive?: boolean;
}) {
  return (
    <div className="rounded-md border bg-background">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2.5 py-2 text-left"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <span className="text-xs font-medium flex-1">{title}</span>
        {badge && (
          <span
            className={`text-[10px] font-medium ${badgePositive === false ? "text-rose-600" : "text-emerald-600"}`}
          >
            {badge}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2.5 pb-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
