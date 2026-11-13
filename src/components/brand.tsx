import Link from "next/link";
import { Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return <Link href="/" aria-label="Shaadi Reply home" className={cn("inline-flex items-center gap-2.5", light ? "text-foreground" : "text-primary")}><span className={cn("grid size-10 place-items-center rounded-full border", light ? "border-border/40" : "border-primary/20")}><Flower2 className="size-6" strokeWidth={1.25} /></span><span className="font-display text-[27px] leading-none tracking-tight">shaadi<span className={cn("ml-1", light ? "text-gold" : "text-gold")}>reply</span>{!compact && <span className={cn("mt-1.5 block font-sans text-[8px] tracking-[.27em] uppercase", light ? "text-muted-foreground" : "text-muted-foreground")}>Together starts here</span>}</span></Link>;
}
