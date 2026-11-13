"use client";
import Link from "next/link";
import { Flower2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main" className="flex min-h-screen flex-col items-center justify-center px-6 text-center"><Flower2 className="mb-5 size-12 text-gold"/><h1 className="font-display text-4xl">A little pause in the planning.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Something didn’t load as expected. Please try again in a moment.</p><div className="mt-6 flex gap-3"><Button onClick={reset}><RotateCcw/>Try again</Button><Button variant="outline" asChild><Link href="/">Back home</Link></Button></div></main>;
}
