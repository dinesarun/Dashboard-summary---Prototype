import type { SummaryModule } from "./mock-summary";

export const REPORT_META = {
  title: "DK – General Widgets",
  dateRange: "Apr 01, 2026 → Jun 30, 2026",
  preparedFor: "Sales leadership",
  executiveHighlights: [
    "Pipeline grew to $148K with win rate climbing from 17% → 21% quarter over quarter.",
    "Email deliverability dropped to 64 — open rate fell 8.3% and needs intervention this week.",
    "Booking volume is healthy (47 appointments) but no-show rate of 25.5% is eroding throughput.",
  ],
};

export type ReportPageDef = {
  id: string;
  title: string;
  dateRange: string;
  widgets: { title: string; kind: "score" | "kpis" | "bar" | "donut"; subtitle?: string }[];
};

export const MOCK_REPORT_PAGES: ReportPageDef[] = [
  {
    id: "p1",
    title: "Sales overview",
    dateRange: "Apr 01, 2026 → Jun 30, 2026",
    widgets: [
      {
        title: "Email Health Report",
        kind: "score",
        subtitle: "Deliverability across all sends",
      },
      {
        title: "Pipeline by stage",
        kind: "bar",
        subtitle: "Opportunity value grouped by current stage",
      },
    ],
  },
  {
    id: "p2",
    title: "Outreach & contacts",
    dateRange: "Apr 01, 2026 → Jun 30, 2026",
    widgets: [
      {
        title: "Contacts Count",
        kind: "kpis",
        subtitle: "May 21, 2026 — May 21, 2026",
      },
      {
        title: "Channel mix",
        kind: "donut",
        subtitle: "Phone · SMS · Email",
      },
    ],
  },
];

export type ReportSummaryPage = {
  pageId: string;
  pageTitle: string;
  modules: SummaryModule[];
};

export const MOCK_REPORT_SUMMARY: ReportSummaryPage[] = [
  {
    pageId: "p1",
    pageTitle: "Sales overview",
    modules: [
      {
        key: "opportunities",
        label: "Opportunities",
        emoji: "💼",
        bullets: [
          "$148K in pipeline currently sitting in Proposal — 6 deals stalled >7 days.",
          "Win rate climbed to 21% (up from 17% last quarter).",
        ],
      },
      {
        key: "emails",
        label: "Email health",
        emoji: "✉️",
        bullets: [
          "Deliverability score 64 — below the 80 healthy threshold.",
          "Open rate down to 23.5% (−8.3% vs prior period). Subject-line A/B suggested.",
        ],
      },
    ],
  },
  {
    pageId: "p2",
    pageTitle: "Outreach & contacts",
    modules: [
      {
        key: "calls",
        label: "Contacts",
        emoji: "👥",
        bullets: [
          "4.01K contacts touched — down 43.7% vs yesterday's spike.",
          "Phone, SMS, and Manual Actions all show zero throughput in the last 24h.",
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
    ],
  },
];
