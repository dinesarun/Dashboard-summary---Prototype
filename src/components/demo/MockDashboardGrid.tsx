import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Phone, Calendar } from "lucide-react";

const KPIS = [
  { label: "Pipeline value", value: "$487K", delta: "+12.4%", up: true, icon: DollarSign },
  { label: "New opportunities", value: "32", delta: "+18%", up: true, icon: Users },
  { label: "Appointments", value: "47", delta: "−4%", up: false, icon: Calendar },
  { label: "Calls connected", value: "168", delta: "+6%", up: true, icon: Phone },
];

function StubChart() {
  const points = [22, 35, 28, 48, 40, 60, 55, 72, 65, 82];
  const w = 320;
  const h = 80;
  const max = Math.max(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (p / max) * h;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <path d={path} fill="none" stroke="oklch(0.55 0.19 295)" strokeWidth="2" />
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="oklch(0.55 0.19 295 / 0.12)" />
    </svg>
  );
}

export function MockDashboardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPIS.map((k) => {
        const Icon = k.icon;
        return (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs">{k.label}</span>
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-2 text-2xl font-semibold">{k.value}</div>
            <div
              className={`mt-1 inline-flex items-center gap-1 text-xs ${
                k.up ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {k.delta} vs last period
            </div>
          </Card>
        );
      })}
      <Card className="p-4 sm:col-span-2 lg:col-span-2">
        <div className="text-sm font-medium">Pipeline trend</div>
        <p className="text-xs text-muted-foreground mb-2">Daily new opportunity value</p>
        <StubChart />
      </Card>
      <Card className="p-4 sm:col-span-2 lg:col-span-2">
        <div className="text-sm font-medium">Conversion funnel</div>
        <p className="text-xs text-muted-foreground mb-3">Lead → Won</p>
        <div className="space-y-2">
          {[
            { l: "Leads", v: 100 },
            { l: "Qualified", v: 64 },
            { l: "Proposal", v: 38 },
            { l: "Won", v: 18 },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-3 text-xs">
              <span className="w-20 text-muted-foreground">{s.l}</span>
              <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                <div
                  className="h-full"
                  style={{ width: `${s.v}%`, backgroundImage: "var(--ai-gradient)" }}
                />
              </div>
              <span className="w-10 text-right tabular-nums">{s.v}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
