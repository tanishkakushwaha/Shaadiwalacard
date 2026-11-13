"use client";
import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Link2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export function ShareActions({ path, names, compact = false }: { path: string; names: string; compact?: boolean }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}${path}`;
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); toast.success("Invitation link copied. Spread the love!"); }
    catch { toast.error("Couldn’t copy automatically. Select the link and copy it below."); }
  }
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`You’re invited to celebrate ${names}! We’d love to have you with us. Please let us know if you can join: ${url}`)}`;
  return <Dialog onOpenChange={()=>setCopied(false)}><DialogTrigger asChild><Button variant={compact ? "default" : "outline"} size={compact ? "default" : "sm"}><Share2/>{compact ? "Share invitation" : "Share link"}</Button></DialogTrigger><DialogContent><span className="mb-5 grid size-12 place-items-center rounded-full bg-rose-surface text-primary"><Link2 className="size-5"/></span><DialogTitle className="font-display text-3xl">Send a little happiness.</DialogTitle><DialogDescription className="mt-3 text-sm leading-6 text-muted-foreground">Share this invitation with your loved ones. They can reply with a simple yes or no, without creating an account.</DialogDescription><div className="mt-6 flex gap-2"><label htmlFor="share-url" className="sr-only">Invitation link</label><Input id="share-url" readOnly value={url} onFocus={e=>e.currentTarget.select()} className="text-xs"/><Button variant="outline" size="icon" onClick={copy} aria-label="Copy invitation link">{copied ? <Check/> : <Copy/>}</Button></div><Button className="mt-4 w-full" asChild><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle/>Share on WhatsApp</a></Button><Button variant="ghost" className="mt-2 w-full" asChild><Link href={path} target="_blank">Preview your invitation <ExternalLink/></Link></Button></DialogContent></Dialog>;
}

export function CopyLink({ path }: { path: string }) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);
  useEffect(()=>setUrl(`${window.location.origin}${path}`), [path]);
  return <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5"><Link2 className="size-3.5 shrink-0 text-muted-foreground"/><input aria-label="Your invitation link" value={url} readOnly onFocus={e=>e.currentTarget.select()} className="min-w-0 flex-1 bg-transparent text-[11px] text-muted-foreground outline-none"/><button aria-label="Copy invitation link" className="rounded p-1 text-primary focus-visible:ring-2 focus-visible:ring-ring" onClick={async()=>{ try { await navigator.clipboard.writeText(url); setCopied(true); toast.success("Invitation link copied!"); } catch { toast.error("Select the link to copy it manually."); } }}>{copied ? <Check className="size-3.5"/> : <Copy className="size-3.5"/>}</button></div>;
}
