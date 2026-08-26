export type ModuleKey = "opportunities" | "appointments" | "emails" | "calls";

export type SummaryModule = {
  key: ModuleKey;
  label: string;
  emoji: string;
  bullets: string[];
};

export const MOCK_SUMMARY: SummaryModule[] = [
  {
    key: "opportunities",
    label: "Opportunities",
    emoji: "💼",
    bullets: [
      "32 new opportunities created this week — up 18% vs last week.",
      "$148K in pipeline currently sitting in the Proposal stage; 6 deals stalled >7 days.",
      "Top source: Facebook Lead Ads (41% of new opps).",
    ],
  },
  {
    key: "appointments",
    label: "Appointments",
    emoji: "📅",
    bullets: [
      "47 appointments booked, 12 no-shows (25.5% no-show rate — above 18% target).",
      "Tuesdays 2–4pm continues to be your highest-converting slot.",
    ],
  },
  {
    key: "emails",
    label: "Emails",
    emoji: "✉️",
    bullets: [
      "Open rate trending down to 22% (was 28% last month). Subject-line A/B suggested.",
      "Sequence 'Onboarding Day 3' has a 41% reply rate — your best performer.",
    ],
  },
  {
    key: "calls",
    label: "Calls",
    emoji: "📞",
    bullets: [
      "Avg. talk time is 4m 12s; calls >6 min close at 2.3× the rate.",
      "9 voicemails left without follow-up SMS — automation gap.",
    ],
  },
];

// Visual ("Visual based") variant — headline + metric + comparison bars per module,
// matching the visual-mode reference design.
export type BarTone = "up" | "down" | "muted";

export type VisualBar = {
  label: string;
  value: number; // percentage width (0–100)
  display: string; // right-aligned label, e.g. "40%"
  tone: BarTone;
};

export type VisualModule = {
  key: ModuleKey;
  label: string;
  emoji: string;
  headline: string;
  tone: BarTone; // colors the headline
  metric: string;
  note: string;
  bars: VisualBar[];
};

export const VISUAL_SUMMARY: VisualModule[] = [
  {
    key: "opportunities",
    label: "Opportunities",
    emoji: "💼",
    headline: "Pipeline building",
    tone: "up",
    metric: "32 new opps · +18% WoW",
    note: "$148K sits in Proposal; 6 deals stalled >7 days. Top source: Facebook Lead Ads (41%).",
    bars: [
      { label: "This week", value: 100, display: "32", tone: "up" },
      { label: "Last week", value: 82, display: "27", tone: "muted" },
    ],
  },
  {
    key: "appointments",
    label: "Appointments",
    emoji: "📅",
    headline: "No-shows climbing",
    tone: "down",
    metric: "47 booked · 25.5% no-show",
    note: "No-show rate is above the 18% target. Tuesdays 2–4pm remains the best-converting slot.",
    bars: [
      { label: "No-show", value: 26, display: "25.5%", tone: "down" },
      { label: "Target", value: 18, display: "18%", tone: "muted" },
    ],
  },
  {
    key: "emails",
    label: "Emails",
    emoji: "✉️",
    headline: "Open rate slipping",
    tone: "down",
    metric: "22% open · was 28%",
    note: "Subject-line A/B suggested. 'Onboarding Day 3' is your best sequence at a 41% reply rate.",
    bars: [
      { label: "This month", value: 22, display: "22%", tone: "down" },
      { label: "Last month", value: 28, display: "28%", tone: "muted" },
    ],
  },
  {
    key: "calls",
    label: "Calls",
    emoji: "📞",
    headline: "Longer calls close",
    tone: "up",
    metric: "avg 4m 12s talk time",
    note: "Calls over 6 min close at 2.3× the rate. 9 voicemails left without a follow-up SMS.",
    bars: [
      { label: ">6 min", value: 100, display: "2.3×", tone: "up" },
      { label: "Under 6 min", value: 43, display: "1.0×", tone: "muted" },
    ],
  },
];

export const FINAL_INSIGHT =
  "Focus on the rising no-show rate and slipping email open rate — both are trending against target this period. Pipeline and call quality are healthy.";

export const PRIOR_THREAD = [
  { role: "user", text: "Summarize dashboard" },
  { role: "ai", text: "Here's your dashboard summary, grouped by module…" },
  { role: "user", text: "What changed since last week?" },
  {
    role: "ai",
    text: "Pipeline value is up 12%, but no-show rate increased by 4 points. Email open rate dropped 6 points — worth investigating.",
  },
];
