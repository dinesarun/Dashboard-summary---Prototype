export type InsightKind = "performance" | "trend" | "anomaly" | "action";

export type Insight = {
  kind: InsightKind;
  label: string;
  headline: string;
  detail: string;
  delta?: string;
  positive?: boolean;
  // tiny chart data 0-100
  series: number[];
  // suggested next steps shown under the insight
  actions: string[];
};

export const TLDR =
  "Revenue is up 12% week-over-week, driven mostly by paid search. Checkout drop-off spiked Tuesday afternoon — worth a look. Two campaigns are over-spending vs. their LTV.";

export const INSIGHTS: Insight[] = [
  {
    kind: "performance",
    label: "Performance",
    headline: "$128.4K revenue",
    detail: "vs. $114.6K last week. Conversions 3,214 (+8%).",
    delta: "+12% WoW",
    positive: true,
    series: [42, 48, 51, 49, 56, 62, 71, 78],
    actions: ["Break down by channel", "Compare this week to last month"],
  },
  {
    kind: "trend",
    label: "Trend highlights",
    headline: "Paid search driving 64% of growth",
    detail: "Brand keywords up 18%; non-brand flat. Email steady at 19%.",
    delta: "+64%",
    positive: true,
    series: [30, 34, 38, 42, 50, 58, 62, 64],
    actions: ["Show top campaigns", "Why is this growing?"],
  },
  {
    kind: "anomaly",
    label: "Anomaly",
    headline: "Checkout drop-off spike Tue 2–4 PM",
    detail: "Cart abandonment +18% vs. 7-day avg. Concentrated on mobile Safari.",
    delta: "+18%",
    positive: false,
    series: [22, 24, 21, 23, 58, 41, 28, 25],
    actions: ["Why did checkout drop on Tuesday?", "See affected devices"],
  },
  {
    kind: "action",
    label: "Recommended action",
    headline: "Pause Campaign #3, reallocate to LP-B",
    detail: "Campaign #3 CAC is 2.1× target. LP-B converts at 4.8% with headroom.",
    series: [55, 52, 48, 44, 40, 36, 32, 28],
    positive: true,
    actions: ["Draft the change", "Show LP-B numbers"],
  },
];

export const GOAL_PRESETS = [
  "Spot what changed this week",
  "Find where revenue is leaking",
  "Prep an exec update",
  "Check campaign performance",
];


export const SUGGESTIONS = [
  "Why did checkout drop on Tuesday?",
  "Compare this week to last month",
  "Which channel has the best ROAS?",
  "Forecast next 7 days",
];

/** Closing follow-ups shown at the end of the generated summary.
 *  Designed to feel participative: the user picks a direction and the
 *  summary is instantly re-centred around it. */
export type FollowUpBlock = {
  prompt: string;
  style: "chips" | "numbered";
  options: string[];
};

export const FOLLOWUP_BLOCKS: FollowUpBlock[] = [
  {
    prompt: "Do you want to curate the summary focusing more on growth parameters like revenue / contacts?",
    style: "chips",
    options: ["Focus on revenue", "Focus on contacts"],
  },
  {
    prompt: "Do you want to turn this into:",
    style: "numbered",
    options: ["a 1-paragraph TLDR", "an executive granular visual kind of summary"],
  },
  {
    prompt: "Do you want to go deeper on a module?",
    style: "chips",
    options: ["Go deeper on Conversations", "Go deeper on Calls", "Go deeper on Emails"],
  },
];

/** Section 1 — "Refine this summary": two labelled rows of chips. */
export const REFINE_FORMAT = ["Make it shorter", "Module by module", "Executive view"];
export const REFINE_FOCUS = ["Revenue", "Contacts", "Pipeline"];

/** Section 2 — "Explore further": max 4 links tied to what the summary flagged. */
export const EXPLORE_LINKS = [
  "Why did checkout drop on Tuesday?",
  "Go deeper on Conversations",
  "Go deeper on Calls",
  "Show the over-spending campaigns",
];




export const CANNED_ANSWERS: Record<string, string> = {
  default:
    "Based on the current report window, the largest contributor was paid search (64% of net growth). I can break this down by campaign or device if helpful.",
  "Why did checkout drop on Tuesday?":
    "Checkout drop-off spiked between 2–4 PM Tuesday, concentrated on mobile Safari. The likely cause is a 3rd-party payment script timing out — error rate jumped 7× during that window before recovering.",
  "Compare this week to last month":
    "Revenue is +12% vs. last week and +21% vs. the same week last month. Paid search and email both improved; direct traffic is flat.",
  "Which channel has the best ROAS?":
    "Email has the highest ROAS at 6.4×, followed by paid search at 3.1×. Display is underperforming at 0.9× — consider trimming.",
  "Forecast next 7 days":
    "If current pacing holds, expect ~$142K next week (±6%). Confidence is moderate given the Tuesday anomaly.",
};

Object.assign(CANNED_ANSWERS, {
  "Break down by channel":
    "Paid search contributed $64.1K (+21%), email $24.3K (+9%), direct $21.8K (flat), organic $12.4K (+4%), display $5.8K (−12%).",
  "Show top campaigns":
    "Top three by revenue: Brand—Exact ($22.4K, ROAS 4.6×), Retargeting—Cart ($13.1K, ROAS 5.2×), Non-brand—Broad ($9.8K, ROAS 1.4×).",
  "Why is this growing?":
    "Brand keyword impressions rose 18% after last Thursday's bid increase, and CPCs fell 6% — more volume at a lower cost is doing most of the work.",
  "See affected devices":
    "92% of the abandonment spike came from mobile Safari 17.x. iOS Chrome and desktop were within normal range.",
  "Draft the change":
    "Suggested change: pause Campaign #3 (CAC $148 vs. $70 target) and move its $1.2K/day budget to LP-B, which converts at 4.8%. Projected impact: +$9K revenue at flat spend.",
  "Show LP-B numbers":
    "LP-B: 12.4K sessions, 4.8% conversion, $61 CAC, 1.9s LCP. Headroom exists — it is currently capped by budget, not traffic quality.",
  "Focus on revenue":
    "Recentred on revenue: $128.4K this week (+12% WoW), $64.1K of it from paid search. Average order value is $39.9 (+3%), and refunds are flat at 1.8%. The Tuesday checkout dip cost an estimated $4.2K.",
  "Focus on contacts":
    "Recentred on contacts: 4,812 new contacts (+9% WoW), 61% from paid search forms. Contact-to-opportunity rate is 18.4% (+1.2pts), and 312 contacts stalled without a first touch in 48 hours.",
  "a 1-paragraph TLDR":
    "TL;DR — Revenue rose 12% to $128.4K on the back of paid search brand keywords, contacts grew 9%, and email remains the most efficient channel at 6.4× ROAS. The one thing to fix: a Tuesday 2–4 PM checkout drop-off on mobile Safari that cost roughly $4.2K. One campaign (#3) is spending at 2.1× target CAC and should be paused.",
  "an executive granular visual kind of summary":
    "Switched to an executive visual layout: each module now leads with its headline metric, a sparkline for the 8-week trend, and a single takeaway line — Performance ($128.4K, ↑), Trend (paid search 64% of growth, ↑), Anomaly (checkout drop-off, ↓), Action (pause Campaign #3). Detail text is collapsed behind each card.",
  "Go deeper on Conversations":
    "Conversations: 2,146 inbound threads (+14%), first-response median 4m 12s (−38s), and 91% resolved within a day. SMS is the fastest-growing channel (+27%); 68 threads are unassigned for over 6 hours and are the main source of slipped SLAs.",
  "Go deeper on Calls":
    "Calls: 842 outbound calls completed (+6%), 38% connected, average duration 5m 22s. Voicemail drop rate is up to 22% on Friday afternoons. Top-performing call outcome is booked appointment (31%).",
  "Go deeper on Emails":
    "Emails: 18.3K sent, 42% open rate, 8.1% click rate. The nurture sequence for trial users has a 14% reply rate. Deliverability dipped slightly to 96.8% on Tuesday due to a spike in bounces from one imported list.",
});


export const PANEL_ACTIONS = [
  "Ask a follow-up",
  "Share summary",
  "Add summary to dashboard",
  "Export to PDF",
  "Change goal",
] as const;

Object.assign(CANNED_ANSWERS, {
  "Make it shorter":
    "Shortened: Revenue $128.4K (+12% WoW), contacts +9%, email most efficient at 6.4× ROAS. Fix the Tuesday 2–4 PM mobile Safari checkout drop (~$4.2K) and pause Campaign #3 (2.1× target CAC).",
  "Module by module":
    "Rebuilt module by module — Performance: $128.4K (+12%). Conversations: 2,146 threads (+14%), 68 unassigned. Calls: 842 completed, 38% connected. Emails: 18.3K sent, 42% open. Each module now leads with its headline metric and one takeaway.",
  "Executive view":
    "Executive view: four cards, each with a headline metric, an 8-week sparkline and one takeaway — Performance ($128.4K ↑), Trend (paid search 64% of growth ↑), Anomaly (checkout drop-off ↓), Action (pause Campaign #3). Detail is collapsed behind each card.",
  Revenue:
    "Focused on revenue: $128.4K this week (+12% WoW), $64.1K from paid search. AOV $39.9 (+3%), refunds flat at 1.8%. The Tuesday checkout dip cost an estimated $4.2K.",
  Contacts:
    "Focused on contacts: 4,812 new contacts (+9% WoW), 61% from paid search forms. Contact-to-opportunity 18.4% (+1.2pts); 312 contacts have had no first touch in 48 hours.",
  Pipeline:
    "Focused on pipeline: $612K open across 1,284 opportunities (+7%). Win rate 22.6% (+0.8pts), average cycle 18 days. $84K is stalled in Proposal for over 14 days — the biggest single drag.",
  "Show the over-spending campaigns":
    "Two campaigns are over-spending vs. LTV: Campaign #3 (CAC $148 vs. $70 target, $1.2K/day) and Non-brand—Broad (ROAS 1.4×, $640/day). Together they account for $1.84K/day of inefficient spend.",
});
