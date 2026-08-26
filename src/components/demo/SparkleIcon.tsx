import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-white shadow-sm",
        className,
      )}
      style={{ backgroundImage: "var(--ai-gradient)" }}
    >
      <Sparkles className="h-3.5 w-3.5" />
    </span>
  );
}
