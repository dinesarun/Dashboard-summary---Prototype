import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { CalendarIcon, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDemoStore, type QuickFilterKey } from "@/lib/demo-store";

const PRESETS = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "This month",
  "This year",
  "Custom",
];

function presetRange(preset: string): { from: Date; to: Date } {
  const today = new Date();
  switch (preset) {
    case "Today":
      return { from: today, to: today };
    case "Yesterday": {
      const y = subDays(today, 1);
      return { from: y, to: y };
    }
    case "Last 7 days":
      return { from: subDays(today, 6), to: today };
    case "Last 30 days":
      return { from: subDays(today, 29), to: today };
    case "This month":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "This year":
      return { from: startOfYear(today), to: endOfYear(today) };
    default:
      return { from: subDays(today, 29), to: today };
  }
}

const COMPARISONS = ["No comparison", "Previous period", "Previous year"];

export function DateRangeFilter() {
  const { filters, setDateRange } = useDemoStore();
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState(filters.datePreset);
  const [comparison, setComparison] = useState(filters.comparison);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(filters.from),
    to: new Date(filters.to),
  });

  const applyPreset = (p: string) => {
    setPreset(p);
    if (p !== "Custom") {
      const r = presetRange(p);
      setRange({ from: r.from, to: r.to });
    }
  };

  const onSelectRange = (r: DateRange | undefined) => {
    setRange(r);
    setPreset("Custom");
  };

  const apply = () => {
    const from = range?.from ? format(range.from, "yyyy-MM-dd") : filters.from;
    const to = range?.to ? format(range.to, "yyyy-MM-dd") : from;
    setDateRange(preset, from, to, comparison);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {filters.datePreset}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={onSelectRange}
            defaultMonth={range?.from}
            className="border-b sm:border-b-0 sm:border-r"
          />
          <div className="w-64 p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Select date range</label>
              <Select value={preset} onValueChange={applyPreset}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                <Input
                  readOnly
                  value={range?.from ? format(range.from, "yyyy-MM-dd") : ""}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <Input
                  readOnly
                  value={range?.to ? format(range.to, "yyyy-MM-dd") : ""}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Comparison date range
              </label>
              <Select value={comparison} onValueChange={setComparison}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPARISONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={apply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const QUICK_FILTERS: { key: QuickFilterKey; label: string; options: string[] }[] = [
  {
    key: "assigned",
    label: "Assigned users",
    options: ["Anyone", "Dinesh P", "Priya K", "Marco S"],
  },
  { key: "tags", label: "Tags", options: ["Any tag", "VIP", "Trial", "Churn risk"] },
  {
    key: "company",
    label: "Company name",
    options: ["All companies", "Acme Co", "Globex", "Initech"],
  },
  { key: "followers", label: "Followers", options: ["Anyone", "Me", "My team"] },
  { key: "contactType", label: "Contact type", options: ["All types", "Lead", "Customer"] },
];

export function QuickFiltersBar() {
  const { filters, setQuickFilter } = useDemoStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--ai-accent)]">
        <SlidersHorizontal className="h-4 w-4" />
        Quick Filters
      </span>
      {QUICK_FILTERS.map((f) => {
        const current = filters.quick[f.key];
        const isActive = !!current;
        return (
          <Select
            key={f.key}
            value={current ?? f.options[0]}
            onValueChange={(v) => setQuickFilter(f.key, v === f.options[0] ? null : v)}
          >
            <SelectTrigger
              className={`h-8 w-auto gap-1.5 rounded-full px-3 text-xs ${
                isActive
                  ? "border-[color:var(--ai-accent)] text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <span>{f.label}</span>
              {isActive && <span className="font-medium">· {current}</span>}
            </SelectTrigger>
            <SelectContent>
              {f.options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
