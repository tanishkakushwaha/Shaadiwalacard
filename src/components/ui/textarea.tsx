import * as React from "react";
import { cn } from "@/lib/utils";
export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn("flex min-h-28 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-ring/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}
