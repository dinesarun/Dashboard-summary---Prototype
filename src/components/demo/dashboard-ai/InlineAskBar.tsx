import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SUGGESTIONS, CANNED_ANSWERS } from "@/lib/mock-dashboard-ai";
import { SparkleIcon } from "../SparkleIcon";

export type QA = { q: string; a: string };

export type AskBarHandle = {
  ask: (question: string) => void;
  fill: (question: string) => void;
  focus: () => void;
};

type Props = {
  compact?: boolean;
  /** When provided, the thread is owned by the parent. */
  history?: QA[];
  onAsk?: (question: string) => void;
  showSuggestions?: boolean;
  busy?: boolean;
};

export const InlineAskBar = forwardRef<AskBarHandle, Props>(function InlineAskBar(
  { compact = false, history: controlledHistory, onAsk, showSuggestions = true, busy = false },
  ref,
) {
  const [value, setValue] = useState("");
  const [localHistory, setLocalHistory] = useState<QA[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const history = controlledHistory ?? localHistory;

  const ask = (q: string) => {
    if (!q.trim()) return;
    if (onAsk) {
      onAsk(q);
    } else {
      const a = CANNED_ANSWERS[q] ?? CANNED_ANSWERS.default;
      setLocalHistory((h) => [...h, { q, a }]);
    }
    setValue("");
  };

  useImperativeHandle(ref, () => ({
    ask,
    fill: (q: string) => {
      setValue(q);
      inputRef.current?.focus();
    },
    focus: () => inputRef.current?.focus(),
  }));

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {history.map((qa, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md border bg-background p-2.5 space-y-1.5"
          >
            <div className="text-xs font-medium text-foreground/90">{qa.q}</div>
            <div className="flex gap-2">
              <SparkleIcon className="!h-5 !w-5 shrink-0" />
              <div className="text-xs text-muted-foreground leading-relaxed">{qa.a}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {showSuggestions && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.slice(0, compact ? 2 : 4).map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                inputRef.current?.focus();
              }}
              className="text-[11px] rounded-full border px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-[color:var(--ai-accent)]/40 hover:bg-[color:var(--ai-accent-soft)] transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(value);
        }}
        className="flex items-center gap-2 rounded-md border bg-background pl-2.5 pr-1 py-1 focus-within:border-[color:var(--ai-accent)]/50"
      >
        <SparkleIcon className="!h-5 !w-5 shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask a follow-up about this report…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white disabled:opacity-40"
          style={{ backgroundImage: "var(--ai-gradient)" }}
          disabled={!value.trim() || busy}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
});
