import * as React from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="badge" className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 py-1 text-[11px] font-medium", className)} {...props} />;
}
