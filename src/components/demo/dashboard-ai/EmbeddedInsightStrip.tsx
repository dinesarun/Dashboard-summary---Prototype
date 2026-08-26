import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Calendar, Share2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { INSIGHTS, TLDR } from "@/lib/mock-dashboard-ai";
import { SparkleIcon } from "../SparkleIcon";
import { InsightBlock } from "./InsightBlock";
import { InlineAskBar } from "./InlineAskBar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function EmbeddedInsightStrip() {
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("2m ago");

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setUpdatedAt("just now");
    }, 800);
  };

  return (
    <Card
      className="p-4 border-[color:var(--ai-accent)]/20"
      style={{ backgroundImage: "var(--ai-gradient-soft)" }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <SparkleIcon />
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              Summary AI widget
              <Badge variant="outline" className="text-[10px] bg-background/60">
                module-native
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground">Updated {updatedAt} · auto-refresh weekly</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={refresh} className="h-8 gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <SchedulePopover />
          <SharePopover />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit prompt</DropdownMenuItem>
              <DropdownMenuItem>Save summary</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {refreshing ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-foreground/90 leading-relaxed mb-4 max-w-4xl"
          >
            {TLDR}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {INSIGHTS.map((i) => (
              <InsightBlock key={i.kind} insight={i} />
            ))}
          </div>

          <div className="rounded-md bg-background/60 p-2.5 border">
            <InlineAskBar />
          </div>
        </>
      )}
    </Card>
  );
}

function SchedulePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Schedule
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="text-sm font-medium mb-2">Schedule summary</div>
        <div className="space-y-1.5 text-sm">
          {["Daily at 9 AM", "Weekly on Mondays", "Monthly on the 1st"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-md border p-2 hover:bg-muted cursor-pointer">
              <input type="radio" name="cadence" defaultChecked={opt.startsWith("Weekly")} />
              <span className="text-xs">{opt}</span>
            </label>
          ))}
        </div>
        <input
          placeholder="Email recipients"
          className="mt-2 w-full text-xs rounded-md border bg-background px-2 py-1.5 outline-none"
        />
        <Button size="sm" className="w-full mt-2">Save schedule</Button>
      </PopoverContent>
    </Popover>
  );
}

function SharePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 gap-1.5">
          <Share2 className="h-3.5 w-3.5" /> Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="text-sm font-medium mb-2">Share summary</div>
        <input
          placeholder="Add people or emails"
          className="w-full text-xs rounded-md border bg-background px-2 py-1.5 outline-none"
        />
        <div className="text-[11px] text-muted-foreground mt-2">
          Recipients will see a snapshot of this summary with last-updated time.
        </div>
        <Button size="sm" className="w-full mt-2">Send</Button>
      </PopoverContent>
    </Popover>
  );
}
