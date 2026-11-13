import Link from "next/link";
import { Flower2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
export default function NotFound() {
  return <div className="paper min-h-screen p-8"><Brand/><main id="main" className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center text-center"><Flower2 className="mb-6 size-12 text-gold" strokeWidth={1}/><p className="eyebrow text-muted-foreground">A little lost?</p><h1 className="font-display mt-3 text-4xl">This invitation took a detour.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">We couldn’t find this page. If you’re here for a wedding, ask the couple to send you their invitation link again.</p><Button className="mt-7" asChild><Link href="/"><ArrowLeft/>Back to home</Link></Button></main></div>;
}
