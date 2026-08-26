import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HighLevelSidebar } from "@/components/demo/ask-ai/HighLevelSidebar";
import { SparkleIcon } from "@/components/demo/SparkleIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_CHATS, ACTIVE_THREAD_ID, threadTitle, type ChatThread } from "@/lib/mock-chats";
import {
  PanelLeft,
  Pencil,
  Search,
  BookOpen,
  Clock,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/ask-ai")({
  component: AskAiPage,
  validateSearch: (search: Record<string, unknown>) => ({
    thread: typeof search.thread === "string" ? search.thread : undefined,
  }),
  head: () => ({
    meta: [{ title: "Ask AI — Dashboard Summary" }],
  }),
});

function AskAiPage() {
  const { thread } = Route.useSearch();
  const navigate = useNavigate();
  const activeId = thread ?? ACTIVE_THREAD_ID;
  const active = MOCK_CHATS.find((t) => t.id === activeId) ?? MOCK_CHATS[0];

  const selectThread = (id: string) => navigate({ to: "/ask-ai", search: { thread: id } });

  return (
    <div className="flex min-h-screen bg-background">
      <HighLevelSidebar />
      <RecentsSidebar activeId={active.id} onSelect={selectThread} />
      <ThreadView thread={active} />
    </div>
  );
}

function RecentsSidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [recentsOpen, setRecentsOpen] = useState(true);
  const tools = [
    { label: "New chat", icon: Pencil },
    { label: "Search", icon: Search },
    { label: "Templates", icon: BookOpen },
    { label: "Scheduled", icon: Clock },
    { label: "Customize", icon: LayoutGrid },
  ];

  return (
    <aside className="w-72 shrink-0 border-r bg-muted/20 flex flex-col h-screen sticky top-0">
      <div className="flex items-center justify-between px-4 py-3">
        <SparkleIcon />
        <button className="text-muted-foreground hover:text-foreground">
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="px-2 space-y-0.5">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.label}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-background hover:text-foreground transition"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="px-4 py-2 mt-1">
        <button className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            Scheduled <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="rounded-full bg-muted px-2 text-xs">1</span>
        </button>
      </div>

      <div className="border-t mx-3" />

      <div className="px-2 pt-3 flex-1 overflow-y-auto">
        <button
          onClick={() => setRecentsOpen((o) => !o)}
          className="flex items-center gap-1 px-2 pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Recents
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${recentsOpen ? "" : "-rotate-90"}`}
          />
        </button>
        {recentsOpen && (
          <div className="space-y-0.5">
            {MOCK_CHATS.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  t.id === activeId
                    ? "bg-background ring-1 ring-border text-foreground"
                    : "text-foreground/70 hover:bg-background hover:text-foreground"
                }`}
              >
                <div className="truncate font-medium">{t.dashboard} Summary</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {t.date} · {t.user}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function ThreadView({ thread }: { thread: ChatThread }) {
  const [input, setInput] = useState("");
  return (
    <main className="flex-1 flex flex-col h-screen">
      <div className="border-b px-6 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SparkleIcon className="!h-5 !w-5" />
          {threadTitle(thread)}
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          Linked to the “{thread.dashboard}” dashboard summary widget
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="text-center text-[11px] text-muted-foreground">Today</div>
          {thread.messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-2"}>
              {m.role === "ai" && <SparkleIcon />}
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-foreground text-background rounded-br-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        <form
          className="mx-auto max-w-2xl flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setInput("");
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="h-11 rounded-full px-4"
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 rounded-full"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </main>
  );
}
