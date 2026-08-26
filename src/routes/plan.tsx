import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
  head: () => ({
    meta: [{ title: "Plan — Dashboard Summary AI" }],
  }),
});

function PlanPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b bg-card/60 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Back to demo
            </Link>
          </Button>
          <div>
            <h1 className="text-sm font-semibold leading-tight">Plan</h1>
            <p className="text-[11px] text-muted-foreground">
              Dashboard Summary AI — spec document
            </p>
          </div>
        </div>
      </header>
      <iframe
        src="/plan/index.html"
        title="Dashboard Summary AI Spec"
        className="h-full w-full flex-1 border-0"
      />
    </div>
  );
}
