import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDemoStore } from "@/lib/demo-store";
import { MOCK_SUMMARY, PRIOR_THREAD } from "@/lib/mock-summary";
import { SparkleIcon } from "./SparkleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Send, RefreshCw } from "lucide-react";

export function AskAIExpandedDialog() {
  const { askExpandedOpen, closeAskExpanded, regenerate, widgetExists, saveAsWidget } =
    useDemoStore();
  return (
    <Dialog open={askExpandedOpen} onOpenChange={(o) => !o && closeAskExpanded()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden h-[80vh] flex">
        <aside className="w-60 border-r bg-muted/30 flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <SparkleIcon /> Ask AI
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 text-sm space-y-1">
            <div className="rounded-md bg-background border px-2.5 py-2">
              <div className="text-xs font-medium truncate">Dashboard summary</div>
              <div className="text-[10px] text-muted-foreground">Today · 4 messages</div>
            </div>
            {[
              "Pipeline drop-off analysis",
              "Top reps last quarter",
              "Email subject A/B ideas",
              "No-show pattern by source",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-background cursor-pointer text-muted-foreground"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="text-xs truncate">{t}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Dashboard summary</div>
              <div className="text-[11px] text-muted-foreground">
                Linked to "Dashboard summary" widget
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => regenerate()} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Update summary
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {PRIOR_THREAD.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-2"}>
                {m.role === "ai" && <SparkleIcon />}
                <div
                  className={`max-w-[70%] px-3 py-2 text-sm rounded-2xl ${
                    m.role === "user"
                      ? "bg-foreground text-background rounded-br-sm"
                      : "bg-muted rounded-tl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <SparkleIcon />
              <div className="max-w-[70%] bg-muted rounded-2xl rounded-tl-sm px-3 py-2 space-y-2">
                <p className="text-sm">Latest summary preview:</p>
                {MOCK_SUMMARY.slice(0, 2).map((m) => (
                  <div key={m.key}>
                    <div className="text-xs font-semibold">
                      {m.emoji} {m.label}
                    </div>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground">
                      {m.bullets.slice(0, 1).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t p-3 space-y-2">
            {widgetExists && (
              <Button onClick={saveAsWidget} variant="outline" size="sm" className="w-full">
                Update summary
              </Button>
            )}
            <div className="flex gap-2">
              <Input placeholder="Ask a follow-up…" />
              <Button size="icon" variant="secondary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
