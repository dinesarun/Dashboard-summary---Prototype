import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDemoStore } from "@/lib/demo-store";
import { MOCK_REPORT_SUMMARY } from "@/lib/mock-report";
import { SparkleIcon } from "./SparkleIcon";
import {
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  Pencil,
  Trash2,
  Lock,
  Info,
  FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function timeAgo(d: Date | null) {
  if (!d) return "just now";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function ReportSummaryWidget() {
  const {
    role,

    deleteWidget,
    openEditDrawer,
    openAskPanel,
    report,
  } = useDemoStore();
  const [openPage, setOpenPage] = useState<string | null>("p1");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [, force] = useState(0);

  useEffect(() => {
    const i = setInterval(() => force((x) => x + 1), 15000);
    return () => clearInterval(i);
  }, []);

  if (!report.exists) return null;
  const isViewer = role === "viewer";
  const { lastUpdated, isGenerating, highlight, settings } = report;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: highlight ? "0 0 0 3px oklch(0.62 0.20 295 / 0.35)" : "0 0 0 0 transparent",
      }}
      transition={{ duration: 0.4 }}
      className="rounded-xl"
    >
      <Card className="overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundImage: "var(--ai-gradient-soft)" }}
        >
          <div className="flex items-center gap-2.5">
            <SparkleIcon />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">{settings.title}</div>
              <div className="text-[11px] text-muted-foreground">
                Updated {timeAgo(lastUpdated)}
              </div>
            </div>
          </div>

          {!isViewer && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={openAskPanel}
                disabled={isGenerating}
                title="Refresh summary in Ask AI"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openAskPanel}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh in Ask AI
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openEditDrawer}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isViewer ? (
          <div className="p-6 text-center space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium">Summary locked for your role</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                You can't see the summary saved by another user, but you can generate your own from
                the data you have access to.
              </p>
            </div>
            <Button size="sm" onClick={openAskPanel} className="gap-2">
              <SparkleIcon className="!h-5 !w-5" />
              Generate your own summary
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {isGenerating ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-4 w-1/4 mt-3" />
                <Skeleton className="h-3 w-full" />
              </div>
            ) : settings.granularity === "page" ? (
              <ul className="divide-y">
                {MOCK_REPORT_SUMMARY.map((p, idx) => {
                  const open = openPage === p.pageId;
                  const bulletCount = p.modules.reduce((n, m) => n + m.bullets.length, 0);
                  return (
                    <li key={p.pageId} className="py-1">
                      <button
                        className="w-full flex items-center justify-between py-2 text-left"
                        onClick={() => setOpenPage(open ? null : p.pageId)}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-3.5 w-3.5 text-[color:var(--ai-accent)]" />
                          Page {idx + 1} · {p.pageTitle}
                          <Badge variant="secondary" className="text-[10px]">
                            {bulletCount}
                          </Badge>
                        </span>
                        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-6 pb-3 space-y-3"
                          >
                            {p.modules.map((m) => (
                              <div key={m.key} className="space-y-1.5">
                                <div className="text-xs font-semibold flex items-center gap-1.5">
                                  <span>{m.emoji}</span>
                                  {m.label}
                                </div>
                                <ul className="text-sm space-y-1 pl-4 text-muted-foreground">
                                  {m.bullets.map((b, i) => (
                                    <li key={i} className="list-disc">
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            ) : settings.granularity === "module" ? (
              <ul className="divide-y">
                {MOCK_REPORT_SUMMARY.flatMap((p) => p.modules).map((m) => (
                  <li key={m.key} className="py-2.5 space-y-1.5">
                    <div className="text-xs font-semibold flex items-center gap-1.5">
                      <span>{m.emoji}</span>
                      {m.label}
                    </div>
                    <ul className="text-sm space-y-1 pl-4 text-muted-foreground">
                      {m.bullets.map((b, i) => (
                        <li key={i} className="list-disc">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="text-sm space-y-1.5 pl-4 text-muted-foreground">
                {MOCK_REPORT_SUMMARY.flatMap((p) => p.modules.flatMap((m) => m.bullets)).map(
                  (b, i) => (
                    <li key={i} className="list-disc">
                      {b}
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        )}
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report summary widget?</AlertDialogTitle>
            <AlertDialogDescription>
              The widget will be removed from this report. The underlying chat thread is kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteWidget}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
