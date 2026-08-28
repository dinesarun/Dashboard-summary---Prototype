import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDemoStore, type Cadence, type Granularity } from "@/lib/demo-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, RefreshCw, Sparkles, Type } from "lucide-react";

export function EditSummaryDrawer() {
  const { editDrawerOpen, closeEditDrawer, settings, updateSettings, view } = useDemoStore();
  const isReport = view === "report";
  const [local, setLocal] = useState(settings);

  useEffect(() => {
    if (editDrawerOpen) {
      setLocal({
        ...settings,
        cadence: settings.cadence || (isReport ? "daily" : "live"),
      });
    }
  }, [editDrawerOpen, settings, isReport]);

  return (
    <Sheet open={editDrawerOpen} onOpenChange={(o) => !o && closeEditDrawer()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize summary</SheetTitle>
        </SheetHeader>

        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              Title
            </Label>
            <Input
              value={local.title}
              onChange={(e) => setLocal({ ...local, title: e.target.value })}
              placeholder="e.g. Summary of 'Sales overview' dashboard"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Summary style
            </Label>
            <Select
              value={local.granularity}
              onValueChange={(v) => setLocal({ ...local, granularity: v as Granularity })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                {isReport ? (
                  <>
                    <SelectItem value="page">Per page</SelectItem>
                    <SelectItem value="module">Per module</SelectItem>
                    <SelectItem value="widget">Per widget</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="module">Text based</SelectItem>
                    <SelectItem value="widget">Visual based</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {isReport
                ? "Page = one section per report page. Module = grouped by product area. Widget = one bullet per widget."
                : "Text based = module-grouped narrative. Visual based = top 3 visual insight cards."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              Refresh frequency
            </Label>
            <Select
              value={local.cadence || undefined}
              onValueChange={(v) => setLocal({ ...local, cadence: v as Cadence })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cadence" />
              </SelectTrigger>
              <SelectContent>
                {isReport ? (
                  <>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="live">Live — updates as and when filters change</SelectItem>
                    <SelectItem value="daily">Once in a day</SelectItem>
                    <SelectItem value="weekly">Once in a week</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--ai-accent)]" />
              Instructions for the Ask AI
            </Label>
            <Textarea
              rows={6}
              value={local.instructions}
              onChange={(e) => setLocal({ ...local, instructions: e.target.value })}
              placeholder="e.g. Focus on pipeline health and at-risk deals. Flag any module where volume dropped >20% week over week. Keep each bullet under 20 words."
            />
            <p className="text-[11px] text-muted-foreground">
              The LLM uses these instructions every time it generates or refreshes this summary.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeEditDrawer}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateSettings(local);
                closeEditDrawer();
                toast.success("Summary widget updated");
              }}
            >
              Apply changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
