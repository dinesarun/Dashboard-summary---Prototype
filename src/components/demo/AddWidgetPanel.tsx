import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDemoStore } from "@/lib/demo-store";
import { SparkleIcon } from "./SparkleIcon";
import { BarChart3, Calendar, Mail, Phone, Users, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MODULES = [
  { label: "Opportunities", icon: DollarSign },
  { label: "Appointments", icon: Calendar },
  { label: "Emails", icon: Mail },
  { label: "Calls", icon: Phone },
  { label: "Contacts", icon: Users },
  { label: "Reports", icon: BarChart3 },
];

export function AddWidgetPanel() {
  const { addWidgetOpen, closeAddWidget, saveAsWidget, widgetExists } = useDemoStore();

  return (
    <Sheet open={addWidgetOpen} onOpenChange={(o) => !o && closeAddWidget()}>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Add widget</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              AI
            </div>
            <button
              onClick={() => {
                if (widgetExists) {
                  toast("Summary widget already on this dashboard");
                  closeAddWidget();
                  return;
                }
                saveAsWidget();
                toast.success("Dashboard summary added");
              }}
              className="w-full flex items-center justify-between gap-3 rounded-lg border-2 p-3 text-left hover:bg-[color:var(--ai-accent-soft)] transition group"
              style={{ borderColor: "oklch(0.55 0.19 295 / 0.25)" }}
            >
              <div className="flex items-center gap-3">
                <SparkleIcon className="!h-9 !w-9 [&_svg]:!h-4 [&_svg]:!w-4" />
                <div>
                  <div className="text-sm font-semibold">Dashboard summary AI</div>
                  <div className="text-[11px] text-muted-foreground">
                    Persistent AI summary of your dashboard
                  </div>
                </div>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--ai-accent)]" />
            </button>
          </section>

          <section>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Modules
            </div>
            <div className="space-y-1">
              {MODULES.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.label}
                    onClick={() => toast(`${m.label} widget — not in demo scope`)}
                    className="w-full flex items-center justify-between rounded-md border bg-background px-3 py-2.5 text-left hover:bg-muted transition"
                  >
                    <div className="flex items-center gap-2.5 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {m.label}
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
