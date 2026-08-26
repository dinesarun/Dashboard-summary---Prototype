// Mock Ask AI chat threads for the Dashboard Summary feature.
// Each thread is one dashboard-summary conversation. Threads are titled
// "<Dashboard name> — <Date> — <Username>".

export type ChatRole = "user" | "ai";
export type ChatMessage = { role: ChatRole; text: string };

export type ChatThread = {
  id: string;
  dashboard: string;
  date: string; // display date
  user: string;
  messages: ChatMessage[];
};

export const CURRENT_USER = "Dinesh P";

export const threadTitle = (t: ChatThread) => `${t.dashboard} — ${t.date} — ${t.user}`;

// The thread linked to the currently-added summary widget (Sales overview).
export const ACTIVE_THREAD_ID = "sales-overview-0826";

export const MOCK_CHATS: ChatThread[] = [
  {
    id: ACTIVE_THREAD_ID,
    dashboard: "Sales overview",
    date: "Aug 26, 2026",
    user: CURRENT_USER,
    messages: [
      { role: "user", text: "Summarize dashboard" },
      {
        role: "ai",
        text: "32 new opportunities came in today (+18% vs. yesterday) with $148K sitting in Proposal — 6 deals have stalled over 7 days. Your no-show rate climbed to 25.5%, mostly from this morning's appointment block.",
      },
      { role: "user", text: "What changed since last week?" },
      {
        role: "ai",
        text: "Pipeline value is up 12%, but no-show rate increased by 4 points. Email open rate dropped 6 points — worth investigating.",
      },
    ],
  },
  {
    id: "marketing-perf-0825",
    dashboard: "Marketing performance",
    date: "Aug 25, 2026",
    user: CURRENT_USER,
    messages: [
      { role: "user", text: "Summarize dashboard" },
      {
        role: "ai",
        text: "Ad spend is pacing 8% under budget while ROAS held at 4.1×. Facebook Lead Ads drove 41% of new opportunities; landing-page conversion slipped to 3.2%.",
      },
      { role: "user", text: "Which channel should I double down on?" },
      {
        role: "ai",
        text: "Facebook Lead Ads — best cost-per-opp at $18 and the highest downstream close rate. Google is 2× more expensive this month.",
      },
    ],
  },
  {
    id: "lead-gen-0822",
    dashboard: "Lead gen funnel",
    date: "Aug 22, 2026",
    user: "Priya K",
    messages: [
      { role: "user", text: "Summarize dashboard" },
      {
        role: "ai",
        text: "Top-of-funnel volume is strong (1,240 leads, +14% WoW) but Qualified→Proposal conversion dropped to 38%. The biggest leak is between form-fill and first contact.",
      },
    ],
  },
  {
    id: "client-retention-0820",
    dashboard: "Client retention",
    date: "Aug 20, 2026",
    user: CURRENT_USER,
    messages: [
      { role: "user", text: "Summarize dashboard" },
      {
        role: "ai",
        text: "Churn ticked up to 4.8% this month. At-risk accounts share a pattern: no login in 21+ days and an open support ticket. 12 accounts match both.",
      },
    ],
  },
  {
    id: "revenue-billing-0818",
    dashboard: "Revenue & billing",
    date: "Aug 18, 2026",
    user: "Marco S",
    messages: [
      { role: "user", text: "Summarize dashboard" },
      {
        role: "ai",
        text: "MRR is $128.4K (+12% WoW). Failed payments are up to 2.1% — mostly expired cards. Dunning recovered $4.2K last week.",
      },
    ],
  },
  {
    id: "support-kpis-0815",
    dashboard: "Support KPIs",
    date: "Aug 15, 2026",
    user: CURRENT_USER,
    messages: [
      { role: "user", text: "Summarize dashboard" },
      {
        role: "ai",
        text: "First-response time improved to 42 min (target 60). CSAT is 4.6/5. Ticket backlog grew 9% — driven by the billing category after the pricing change.",
      },
    ],
  },
];
