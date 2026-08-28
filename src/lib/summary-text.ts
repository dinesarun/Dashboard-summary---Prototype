// Builds plain-text representations of the summary for the "Copy" action.
// Text mode copies the narrative bullets; visual mode serializes the cards
// (headline, metric, note, and each comparison bar) into readable text.
import { MOCK_SUMMARY, VISUAL_SUMMARY, FINAL_INSIGHT } from "./mock-summary";
import { TODAYS_INSIGHTS } from "@/components/demo/TodaysInsights";

export function textSummaryToClipboard(title?: string): string {
  const lines: string[] = [];
  if (title) lines.push(title, "");
  lines.push(`Today's insights: ${TODAYS_INSIGHTS}`, "");
  MOCK_SUMMARY.forEach((m) => {
    lines.push(`${m.emoji} ${m.label}`);
    m.bullets.forEach((b) => lines.push(`  • ${b}`));
    lines.push("");
  });
  return lines.join("\n").trim();
}

export function visualSummaryToClipboard(title?: string): string {
  const lines: string[] = [];
  if (title) lines.push(title, "");
  lines.push(`Today's insights: ${TODAYS_INSIGHTS}`, "");
  VISUAL_SUMMARY.forEach((m) => {
    lines.push(`${m.emoji} ${m.label} — ${m.headline}`);
    lines.push(`  ${m.metric}`);
    lines.push(`  ${m.note}`);
    m.bars.forEach((b) => lines.push(`  • ${b.label}: ${b.display}`));
    lines.push("");
  });
  lines.push(`Final insight: ${FINAL_INSIGHT}`);
  return lines.join("\n").trim();
}
