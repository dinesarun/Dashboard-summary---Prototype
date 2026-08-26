# HighLevel — AI Summary Widgets (Interactive Prototype)

A clickable, working prototype of the **AI-powered summary experiences** for HighLevel dashboards and custom reports. Built to demonstrate the feature flow to the product and engineering teams — it is **not** a full application. All data is mock data; no backend or real AI calls are made.

## What this prototype demonstrates

### 1. Today's Insights strip
- Appears at the top of the dashboard, below the toolbar.
- Shows a pre-generated 2-line insight about today.
- **Dig deeper** opens the Ask AI panel — the first lines of the panel summary match the strip exactly (strip = TLDR, panel = full expansion).
- Can be dismissed with the × button (stays hidden for the session).

### 2. Ask AI panel (dashboard summary)
- Opened via the ✦ sparkle icon in the header or the strip's **Dig deeper**.
- Shows a goal-first summary: today's insights + module-by-module breakdown.
- Ends with participative follow-ups:
  - **Refine this summary** — Format chips (Make it shorter / Module by module / Executive view) and Focus chips (Revenue / Contacts / Pipeline).
  - **Explore further** — arrow-prefixed links like "Go deeper on Calls".
- **Add summary to dashboard** CTA pins the summary as a persistent widget.

### 3. Dashboard summary widget
- Persistent widget on the dashboard canvas, titled *Summary of 'Sales overview' dashboard*.
- Contains the Today's Insights paragraph followed by module cards (horizontal grid, with Show more / Show less).
- Highlight any text → floating **Dig deeper** pill opens Ask AI.
- Three-dot menu: **Modify** (opens edit drawer), **Reset to Default**, **Delete**.
- Refresh icon appears in the header only when a daily/weekly cadence is set.

### 4. Edit summary drawer
- **Summary mode**: Text based / Visual based.
- **Refresh cadence**: Live / Once in a day / Once in a week (dashboard).
- **Instructions for the AI**: free-text guidance used on every generation.

### 5. Summary AI — side panel concept (`/dashboard-ai`)
- An alternate exploration: a docked "Summary AI" rail beside the dashboard canvas.
- Goal selection first (preset goals or custom), then goal-aware summary blocks with sparklines, refine/focus chips, and an inline follow-up box that regenerates the whole summary.

### 6. Custom Reporting view
- Switch between **Dashboard** and **Custom Reporting** in the header dropdown.
- Report canvas is page-based: title page with executive highlights (only when a report summary exists), then a full-page **Report Summary** on page 2.
- Report summary supports Per page / Per module / Per widget granularity and Daily → Yearly cadences.

## How to run

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. Routes:

| Route | What it shows |
|---|---|
| `/` | Dashboard view with Today's insights, Ask AI, and the summary widget |
| `/dashboard-ai` | Summary AI side-panel concept |
| `/plan` | The original planning document |

## Notes

- Everything is front-end only; insights are realistic mock content.
- State resets on page refresh (except the insights-strip dismissal, which lasts the session).

For architecture and code details, see **README-developer.md**.
