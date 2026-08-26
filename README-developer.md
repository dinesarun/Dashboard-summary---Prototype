# Developer Guide — AI Summary Widgets Prototype

Technical companion to [README.md](README.md). This prototype is front-end only: no backend, no real LLM calls, no auth. All "AI" output is canned mock data with simulated latency.

## Stack

- **TanStack Start v1** (React 19, SSR) with **TanStack Router** — file-based routes in `src/routes/`.
- **Vite 7** build, deployed to a Workers-style edge runtime.
- **Tailwind CSS v4** via `src/styles.css` (native CSS `@import` + theme tokens; no `tailwind.config.js`).
- **zustand** for global demo state, **framer-motion** for animations, **sonner** for toasts.
- **shadcn/ui** components in `src/components/ui/`.

## Routes

| File | Path | Purpose |
|---|---|---|
| `src/routes/index.tsx` | `/` | Dashboard + Custom Reporting surfaces, widget flow |
| `src/routes/dashboard-ai.tsx` | `/dashboard-ai` | Summary AI side-panel concept (Concept B) |
| `src/routes/plan.tsx` | `/plan` | Static planning document |
| `src/routes/__root.tsx` | — | Root layout, fonts, `<Toaster />` |

## State: `src/lib/demo-store.ts`

Single zustand store. Key model:

- **Two surfaces** — `dashboard` and `report`, each a `Surface { exists, lastUpdated, isGenerating, highlight, settings }`. Actions patch the *active* surface based on `view`.
- **Legacy mirror fields** (`widgetExists`, `lastUpdated`, `isGenerating`, `highlightWidget`, `settings`) are synced from the active surface so older components read one shape.
- `view: "dashboard" | "report"` — switched by `ViewSwitcher`; switching resets `editMode`.
- `settings: { granularity, cadence, instructions }` — granularity differs per surface (`page|module|widget` for report; `module|widget` = Text/Visual based for dashboard).
- Panel/drawer open flags: `askPanelOpen`, `askExpandedOpen`, `addWidgetOpen`, `editDrawerOpen`, plus `editMode` and `role` (editor/viewer).
- `insightsDismissed` — persisted in `sessionStorage` under `todays-insights-dismissed`; SSR-safe via a `typeof window` guard.
- `saveAsWidget()` — creates the widget on the active surface, dismisses the insights strip (dashboard only), closes panels, toasts, and sets a temporary `highlight` (cleared after ~2.4s) that drives the widget's glow pulse.
- `regenerate()` — simulated 1.5s generation.

## Component map (`src/components/demo/`)

**Dashboard surface**
- `DashboardHeader.tsx` — logo, `ViewSwitcher`, ✦ icon-only Ask AI button, Summary AI link, edit-mode toggle.
- `TodaysInsights.tsx` — dismissible strip; exports `TODAYS_INSIGHTS` (reused as the intro paragraph inside `SummaryWidget` and the Ask AI summary to keep content continuity).
- `SummaryWidget.tsx` — the persistent widget. Subtitle-only header (*Summary of 'Sales overview' dashboard*), conditional refresh icon (daily/weekly cadence only), three-dot menu (Modify / Reset to Default / Delete), text-selection **Dig deeper** pill, horizontal module grid with Show more/less, delete confirmation dialog.
- `AskAIPanel.tsx` — side panel: goal-first summary, refine/focus chips, explore links, inline follow-up input, "Add summary to dashboard" CTA.
- `EditSummaryDrawer.tsx` — sheet with Summary mode, Refresh cadence (per-surface options), Instructions textarea.
- `MockDashboardGrid.tsx`, `AddWidgetPanel.tsx` — dashboard canvas + widget picker.

**Custom reporting surface**
- `CustomReportingView.tsx`, `ReportPage.tsx`, `ReportSummaryWidget.tsx`, `ReportAddWidgetPanel.tsx` — page-based report canvas; title page shows executive highlights only when the report summary widget exists; summary occupies page 2 by default.

**Summary AI side-panel concept** (`src/components/demo/dashboard-ai/`)
- `SideInsightPanel.tsx` — docked rail (`h-[calc(100vh-6.5rem)]`, sticky) with goal selection, insight blocks, refine/explore sections, pinned CTA.
- `InsightBlock.tsx`, `MiniSparkline.tsx`, `EmbeddedInsightStrip.tsx`, `InlineAskBar.tsx`, `MockReportCanvas.tsx`.

**Shared**
- `SparkleIcon.tsx` — brand ✦ icon. `ViewSwitcher.tsx` — dashboard/report dropdown.

## Mock data

- `src/lib/mock-summary.ts` — `MOCK_SUMMARY` module cards (emoji, label, bullets).
- `src/lib/mock-dashboard-ai.ts` — side-panel insights, goals, refine/focus chip options, explore links, and keyed mock responses for refinements.
- `src/lib/mock-report.ts` — report pages/widgets.
- Regeneration/refinement cycles through canned responses; there is no prompt assembly.

## Conventions & gotchas

- **Design tokens only** — colors come from CSS variables in `src/styles.css` (e.g. `--ai-gradient-soft`, `--ai-accent`); don't hardcode palette utilities.
- **SSR** — browser storage is read behind `typeof window` guards / `useEffect`; keep it that way.
- **Router** — TanStack Router is fixed; never add react-router. Don't edit `src/routeTree.gen.ts` (generated).
- **Toasts** — `sonner`; `<Toaster />` is mounted once in `__root.tsx`.
- No tests; verification is manual via the preview + build logs.

## Run / build

```bash
npm install
npm run dev     # local dev server
npm run build   # production build
```
