import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoStore } from "@/lib/demo-store";
import { ChevronDown, LayoutDashboard, FileBarChart2, Check } from "lucide-react";

export function ViewSwitcher() {
  const { view, setView } = useDemoStore();
  const isReport = view === "report";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 rounded-md px-1.5 py-1 -ml-1.5 hover:bg-muted transition text-left">
          <div>
            <div className="flex items-center gap-1.5 text-base font-semibold leading-tight">
              {isReport ? "Custom Reporting" : "Dashboard"}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isReport
                ? "DK – General Widgets · This Quarter"
                : "Sales overview · Last 30 days"}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => setView("dashboard")} className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="flex-1">Dashboard</span>
          {!isReport && <Check className="h-4 w-4 text-[color:var(--ai-accent)]" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setView("report")} className="gap-2">
          <FileBarChart2 className="h-4 w-4" />
          <span className="flex-1">Custom Reporting</span>
          {isReport && <Check className="h-4 w-4 text-[color:var(--ai-accent)]" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
