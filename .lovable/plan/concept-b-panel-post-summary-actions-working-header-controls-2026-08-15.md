# Concept B panel — post-summary actions + working header controls

Scope: the Summary AI side panel on `/dashboard-ai` only. Mocked data, no backend.

## 1. What the user does after the summary

Add two layers of next-step affordances, in the spirit of the Google AI Overview screenshot but tuned for a reporting product.

**a. Per-insight action links** (inside each insight card, under the sparkline)
Small text links, 2 per insight, contextual to the insight kind:
- Performance → "Break down by channel" · "Compare to last month"
- Trend → "Show top campaigns" · "Why is this growing?"
- Anomaly → "Investigate Tuesday drop" · "See affected devices"
- Recommended action → "Draft the change" · "Show LP-B numbers"

Clicking a link feeds the question into the panel's ask thread and answers from the existing canned-answer set (falls back to the default answer), so every link visibly does something.

**b. Panel-level "What next?" row** (between the insights and the ask bar)
A compact row of chips that act on the whole summary rather than one insight:
- Ask a follow-up (focuses the ask input)
- Share summary (toast: "Summary link copied")
- Save as dashboard widget (toast confirming it would persist as the widget from the main demo)
- Export to PDF (toast)
- Change goal (returns to the goal picker)

These are deliberately mocked with toasts — they communicate intent to the dev team without pulling in real infra. Toasts use the existing sonner setup (mounted in `__root` if not already).

## 2. Header controls — real behaviour

- **Refresh**: keeps the spin, but now also updates a real "last generated" timestamp shown in the sub-label ("3 insights · just now", ticking to "2m ago"), clears any ask-thread answers, and re-runs the skeleton state. So the user sees the summary actually regenerate against the current goal.
- **Pin**: pinning is what keeps the panel open across concept switches and page navigation. Pinned = panel stays open and cannot be closed by mistake (close button hidden while pinned, tooltip "Unpin to close"). Unpinned = panel auto-collapses to the rail when the user scrolls the report canvas, and reopens on click. Tooltip states this.
- **Close**: collapses the panel to the vertical rail (it does not delete anything). Today that's unclear, so: add a tooltip "Collapse panel", and the collapsed rail keeps the "3 new" badge so re-opening is obvious. Only shown when unpinned.

Each of the three buttons gets a tooltip so the roles are self-explanatory in a demo walkthrough.

## Technical notes

- `src/lib/mock-dashboard-ai.ts`: add `actions: string[]` per insight (question strings that map into `CANNED_ANSWERS`), plus a `PANEL_ACTIONS` list.
- `src/components/demo/dashboard-ai/InsightBlock.tsx`: render action links; accept an `onAction(question)` callback.
- `src/components/demo/dashboard-ai/InlineAskBar.tsx`: expose an imperative `ask()` + focus via a ref or lift the thread state into the panel so insight links and the "Ask a follow-up" chip can push questions in.
- `src/components/demo/dashboard-ai/SideInsightPanel.tsx`: add `lastGeneratedAt` state, tooltips (shadcn `Tooltip`), pin/close interplay, the "What next?" chip row, and toast handlers.
- Auto-collapse-on-scroll for the unpinned state is driven from `src/routes/dashboard-ai.tsx` canvas scroll handler passed down as a prop.
