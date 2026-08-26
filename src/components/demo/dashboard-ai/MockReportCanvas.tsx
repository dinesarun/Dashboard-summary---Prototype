import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MiniSparkline } from "./MiniSparkline";

const KPIS = [
  { label: "Revenue", value: "$128.4K", delta: "+12.3%", up: true, series: [42, 48, 51, 49, 56, 62, 71, 78] },
  { label: "Conversions", value: "3,214", delta: "+8.1%", up: true, series: [30, 34, 38, 36, 42, 48, 52, 56] },
  { label: "AOV", value: "$39.95", delta: "+3.6%", up: true, series: [55, 56, 58, 57, 60, 62, 63, 64] },
  { label: "CAC", value: "$24.10", delta: "-4.2%", up: false, series: [70, 68, 65, 64, 60, 58, 55, 52] },
];

const CHANNELS = [
  { name: "Paid search", value: 64, color: "oklch(0.62 0.20 295)" },
  { name: "Email", value: 19, color: "oklch(0.68 0.17 200)" },
  { name: "Direct", value: 9, color: "oklch(0.72 0.14 160)" },
  { name: "Social", value: 5, color: "oklch(0.72 0.16 60)" },
  { name: "Display", value: 3, color: "oklch(0.65 0.05 260)" },
];

export function MockReportCanvas() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPIS.map((k) => (
          <Card key={k.label} className="p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{k.label}</div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <div className="text-xl font-semibold tracking-tight">{k.value}</div>
              <span className={`inline-flex items-center text-[11px] ${k.up ? "text-emerald-600" : "text-rose-600"}`}>
                {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {k.delta}
              </span>
            </div>
            <MiniSparkline series={k.series} positive={k.up} width={180} height={32} className="mt-2 w-full" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">Revenue trend</div>
              <div className="text-xs text-muted-foreground">Last 8 weeks</div>
            </div>
            <div className="text-xs text-muted-foreground">Weekly</div>
          </div>
          <RevenueChart />
        </Card>

        <Card className="p-4">
          <div className="text-sm font-semibold mb-3">Traffic by channel</div>
          <div className="space-y-2">
            {CHANNELS.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground/80">{c.name}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div style={{ width: `${c.value}%`, background: c.color }} className="h-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function RevenueChart() {
  const data = [82, 91, 88, 95, 102, 108, 114, 128];
  const max = Math.max(...data);
  const w = 100;
  const h = 32;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-32">
      {data.map((v, i) => {
        const bw = w / data.length - 1.2;
        const bh = (v / max) * (h - 4);
        return (
          <rect
            key={i}
            x={i * (w / data.length) + 0.6}
            y={h - bh}
            width={bw}
            height={bh}
            rx={0.6}
            fill={i === data.length - 1 ? "oklch(0.62 0.20 295)" : "oklch(0.62 0.20 295 / 0.5)"}
          />
        );
      })}
    </svg>
  );
}
