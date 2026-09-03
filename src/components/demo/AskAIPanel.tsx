import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/lib/demo-store";
import { MOCK_SUMMARY, PRIOR_THREAD } from "@/lib/mock-summary";
import {
  REFINE_FORMAT,
  REFINE_FOCUS,
  EXPLORE_LINKS,
  CANNED_ANSWERS,
} from "@/lib/mock-dashboard-ai";
import { SparkleIcon } from "./SparkleIcon";
import { TODAYS_INSIGHTS } from "./TodaysInsights";
import { ArrowRight, Copy, Maximize2, RefreshCw, Save, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { textSummaryToClipboard } from "@/lib/summary-text";

export function AskAIPanel() {
  const {
    askPanelOpen,
    closeAskPanel,
    saveAsWidget,
    openAskExpanded,
    widgetExists,
    view,
    askSeed,
    clearAskSeed,
    todaysInsightsEnabled,
  } = useDemoStore();
  const surfaceLabel = view === "report" ? "report" : "dashboard";
  const [streamed, setStreamed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState<{ q: string; a: string }[]>([]);
  const [asking, setAsking] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!askPanelOpen) return;
    setStreamed(0);
    setLoading(true);
    setThread([]);
    setAsking(false);
    setInput("");
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [askPanelOpen]);

  useEffect(() => {
    if (loading || !askPanelOpen) return;
    if (streamed >= MOCK_SUMMARY.length) return;
    const t = setTimeout(() => setStreamed((n) => n + 1), 280);
    return () => clearTimeout(t);
  }, [streamed, loading, askPanelOpen]);

  const done = !loading && streamed >= MOCK_SUMMARY.length;

  const copySummary = () => {
    navigator.clipboard.writeText(textSummaryToClipboard()).then(
      () => toast.success("Summary copied to clipboard"),
      () => toast.error("Couldn't copy the summary"),
    );
  };

  const ask = (q: string, customAnswer?: string) => {
    if (!q.trim()) return;
    setAsking(true);
    setInput("");
    setTimeout(() => {
      setThread((t) => [
        ...t,
        { q, a: customAnswer ?? CANNED_ANSWERS[q] ?? CANNED_ANSWERS.default },
      ]);
      setAsking(false);
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    }, 700);
  };

  // Seed a "dig deeper" question from text the user highlighted in the widget.
  const seedConsumed = useRef(false);
  useEffect(() => {
    if (!askPanelOpen) seedConsumed.current = false;
  }, [askPanelOpen]);
  useEffect(() => {
    if (done && askSeed && !seedConsumed.current) {
      seedConsumed.current = true;
      ask(askSeed, digDeeperAnswer(askSeed));
      clearAskSeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, askSeed]);

  return (
    <Sheet open={askPanelOpen} onOpenChange={(o) => !o && closeAskPanel()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <SparkleIcon /> Ask AI
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={openAskExpanded}
            title="Expand"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* prior thread */}
          {widgetExists &&
            PRIOR_THREAD.slice(0, 2).map((m, i) => (
              <Bubble key={i} role={m.role as "user" | "ai"}>
                {m.text}
              </Bubble>
            ))}

          <Bubble role="user">Summarize this {surfaceLabel}</Bubble>

          <Bubble role="ai">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            ) : (
              <div className="space-y-3">
                {todaysInsightsEnabled && (
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-[color:var(--ai-accent)]">
                      Today&apos;s insights:{" "}
                    </span>
                    {TODAYS_INSIGHTS}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Here&apos;s the breakdown by module:
                </p>
                {MOCK_SUMMARY.slice(0, streamed).map((m) => (
                  <motion.div
                    key={m.key}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-sm font-semibold mb-1">
                      {m.emoji} {m.label}
                    </div>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                      {m.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                {!done && (
                  <div className="text-xs text-muted-foreground animate-pulse">Generating…</div>
                )}

                {done && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={copySummary}
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition"
                    >
                      <Copy className="h-3 w-3" /> Copy summary
                    </button>
                  </div>
                )}

                {/* participative follow-ups at the end of the summary */}
                {done && (
                  <FollowUps
                    ask={ask}
                    onSave={saveAsWidget}
                    widgetExists={widgetExists}
                    view={view}
                    showSave
                  />
                )}
              </div>
            )}
          </Bubble>

          {thread.map((t, i) => (
            <div key={i} className="space-y-4">
              <Bubble role="user">{t.q}</Bubble>
              <Bubble role="ai">
                <div className="space-y-3">
                  <p className="text-sm">{t.a}</p>
                  {/* follow-ups repeat, but the save/add-to-dashboard CTA stays on the initial summary only */}
                  <FollowUps
                    ask={ask}
                    onSave={saveAsWidget}
                    widgetExists={widgetExists}
                    view={view}
                  />
                </div>
              </Bubble>
            </div>
          ))}

          {asking && (
            <Bubble role="ai">
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </Bubble>
          )}
          <div ref={bottomRef} />
        </div>

        {done && (
          <div className="border-t p-3 bg-muted/30">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up…"
                className="h-9"
              />
              <Button
                type="submit"
                size="icon"
                variant="secondary"
                className="h-9 w-9"
                disabled={!input.trim() || asking}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Produce a contextual "dig deeper" answer for the text the user highlighted.
function digDeeperAnswer(selection: string): string {
  const s = selection.toLowerCase();
  if (s.includes("no-show") || s.includes("no show"))
    return "Digging into no-shows: 12 of 47 booked (25.5%) didn't show — 8 came from this morning's block. The common thread is a 24h+ gap between booking and appointment with no SMS reminder. Turning on a 2-hour reminder on that calendar has historically cut no-shows by ~30%.";
  if (s.includes("proposal") || s.includes("stalled") || s.includes("pipeline"))
    return "Digging into the pipeline: $148K sits in Proposal and 6 deals have had no activity for 7+ days — 4 are with the same rep. A nudge sequence on deals idle >5 days typically recovers ~20% within a week.";
  if (s.includes("opportunit") || s.includes("facebook") || s.includes("lead ads"))
    return "Digging into opportunities: 32 new this week (+18% WoW), 41% from Facebook Lead Ads. Lead→Qualified is healthy at 64%, but Proposal→Won is only 18% — the drop-off is at proposal, not top-of-funnel.";
  if (s.includes("open rate") || s.includes("email") || s.includes("subject"))
    return "Digging into email: open rate fell to 22% (was 28%). The dip is concentrated in the weekly digest send; 'Onboarding Day 3' still replies at 41%. A subject-line A/B on the digest is the highest-leverage fix.";
  if (s.includes("call") || s.includes("voicemail") || s.includes("talk time"))
    return "Digging into calls: avg talk time is 4m 12s, and calls over 6 min close at 2.3× the rate. 9 voicemails were left with no follow-up SMS — wiring an automation there could recover several conversations.";
  const trimmed = selection.length > 90 ? selection.slice(0, 90) + "…" : selection;
  return `Here's a closer look at "${trimmed}": the pattern holds across the last 30 days, with the sharpest movement in the most recent week. Want me to break it down by source or by rep?`;
}

function FollowUps({
  ask,
  onSave,
  widgetExists,
  view,
  showSave = false,
}: {
  ask: (v: string) => void;
  onSave: () => void;
  widgetExists: boolean;
  view: string;
  showSave?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border bg-background p-3 mt-1 space-y-3"
    >
      {/* Section 1 — Refine this summary */}
      <div>
        <div className="flex items-center gap-1.5">
          <SparkleIcon className="!h-4 !w-4" />
          <div className="text-[11px] font-semibold text-foreground">Refine this summary</div>
        </div>
        <div className="mt-2 space-y-2">
          <ChipRow label="Format:" options={REFINE_FORMAT} onSelect={ask} />
          <ChipRow label="Focus on:" options={REFINE_FOCUS} onSelect={ask} />
        </div>
      </div>

      {/* Section 2 — Explore further */}
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

      {showSave && (
        <div className="border-t pt-3">
          {!widgetExists ? (
            <Button onClick={onSave} className="w-full gap-2">
              <Save className="h-4 w-4" />{" "}
              {view === "report" ? "Add to report" : "Add summary to dashboard"}
            </Button>
          ) : (
            <Button onClick={onSave} variant="outline" className="w-full gap-2">
              <RefreshCw className="h-4 w-4" /> Update summary
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function Chip({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-[11px] text-foreground/80 hover:text-foreground hover:border-[color:var(--ai-accent)]/40 hover:bg-[color:var(--ai-accent-soft)] transition"
    >
      {children}
    </button>
  );
}

function ChipRow({
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
        <Chip key={o} onClick={() => onSelect(o)}>
          {o}
        </Chip>
      ))}
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-foreground text-background px-3 py-2 text-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <SparkleIcon />
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2">{children}</div>
    </div>
  );
}
