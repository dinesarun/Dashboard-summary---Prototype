# Concept B — Goal-first Summary AI panel

Two changes, both scoped to the Concept B side panel on `/dashboard-ai`. No backend, no store changes.

## 1. Ask the goal before generating

The panel opens in a new **goal state** instead of showing insights immediately:

- Header stays as-is (sparkle, title, close).
- Body shows a short prompt: "What do you want this summary to focus on?"
- 4 preset goal chips, each one tap to select:
  - Spot what changed this week
  - Find where revenue is leaking
  - Prep an exec update
  - Check campaign performance
- Below the chips, a free-text box ("Or describe your goal…") with a **Generate summary** button, enabled once a preset is picked or text is typed.
- On generate: 900ms skeleton loading, then the existing insight sections render.
- The chosen goal shows as a small removable chip under the panel header ("Goal: Prep an exec update" · change), and clicking "change" returns to the goal state.
- Insight copy stays mocked as today; only the goal chip reflects the selection (the demo does not re-write insights per goal — noted as future scope).

## 2. Panel visible in the first fold

Currently the meta header + rationale strip + reporting sub-header push the panel below the fold. Fix by making the page a fixed-height layout instead of a scrolling document:

- The page becomes a column that fills the viewport; only the report canvas scrolls internally.
- The panel becomes `h-full` inside that row, so its top edge sits right under the sub-header and it is fully visible without page scrolling.
- Collapse the rationale strip into a single compact line (and drop the mockup footer from the Concept B layout) to reclaim vertical space.
- Verified at the current 851x842 viewport and at desktop width.

## Technical notes

- `src/components/demo/dashboard-ai/SideInsightPanel.tsx`: add `goal` / `hasGenerated` local state, a `GoalPicker` sub-view, goal chip; swap the fixed `calc(100vh - 9rem)` sticky height for `h-full` within a flex parent.
- `src/routes/dashboard-ai.tsx`: wrap the Concept B branch in a viewport-height flex container with an internally scrolling canvas column; keep Concept A behaviour unchanged.
- Preset goals added to `src/lib/mock-dashboard-ai.ts` as a `GOAL_PRESETS` export.
