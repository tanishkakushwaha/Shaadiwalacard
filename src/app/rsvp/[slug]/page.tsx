import type { Metadata } from "next";
import Link from "next/link";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, Flower2, Heart, MapPin, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { demoWedding } from "@/lib/demo";
import { formatDate, formatTime, rsvpIsOpen } from "@/lib/dates";
import { Brand } from "@/components/brand";
import { Divider, Floral } from "@/components/ornaments";
import { RsvpForm } from "@/components/rsvp-form";
export const metadata: Metadata = { title: "You’re invited to celebrate", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = slug === "demo";
  const wedding = demo ? demoWedding : await db().wedding.findUnique({ where: { slug }, select: { id: true, slug: true, partnerOne: true, partnerTwo: true, date: true, time: true, venue: true, city: true, message: true, deadline: true, isOpen: true } });
  if (!wedding) notFound();
  let previous = null;
  if (!demo) {
    const token = (await cookies()).get(`shaadi-rsvp-${wedding.id}`)?.value;
    if (token && /^[a-f0-9]{64}$/.test(token)) previous = await db().response.findUnique({ where: { weddingId_tokenHash: { weddingId: wedding.id, tokenHash: createHash("sha256").update(token).digest("hex") } }, select: { name: true, attending: true, guests: true, message: true } });
  }
  return <div className="paper min-h-screen">{demo && <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-border bg-gold-surface px-5 py-2.5 text-[11px] text-gold"><span>You’re exploring a sample wedding invitation.</span><Link href="/demo" className="font-medium underline underline-offset-3">Back to demo dashboard <ArrowRight className="inline size-3"/></Link></div>}<header className="mx-auto flex max-w-6xl items-center justify-center px-6 py-7"><Brand compact/></header><main id="main" className="mx-auto grid max-w-[1000px] items-start gap-8 px-5 pt-4 pb-12 md:grid-cols-[1.1fr_1fr] md:gap-10 sm:px-8"><section aria-label="Wedding invitation" className="paper relative overflow-hidden rounded-t-[210px] rounded-b-xl border border-invitation-border bg-invitation px-7 pt-14 pb-10 text-center sm:px-10"><div className="pointer-events-none absolute inset-3 rounded-t-[200px] rounded-b-md border border-invitation-border"/><Floral className="pointer-events-none absolute right-[-65px] bottom-[-35px] h-[310px] w-48 rotate-[-30deg] text-gold opacity-30"/><Floral className="pointer-events-none absolute bottom-[-35px] left-[-65px] h-[310px] w-48 scale-x-[-1] rotate-[-30deg] text-gold opacity-20"/><Flower2 className="mx-auto size-10 text-gold" strokeWidth={1}/><p className="eyebrow mt-7 text-[10px] text-gold">Together with their families</p><p className="mt-3 text-[11px] leading-5 text-muted-foreground">joyfully invite you to celebrate their wedding</p><h1 className="font-display relative mt-8 break-words text-[49px] leading-tight tracking-tight text-primary sm:text-[57px]">{wedding.partnerOne}<span className="my-2 block text-4xl text-gold italic">&</span>{wedding.partnerTwo}</h1><Divider className="my-7"/><div className="relative space-y-3 text-xs text-muted-foreground"><p className="flex items-center justify-center gap-2"><CalendarDays className="size-3.5"/>{formatDate(wedding.date)}</p><p className="flex items-center justify-center gap-2"><Clock3 className="size-3.5"/>{formatTime(wedding.time)} onwards · IST</p><div className="pt-3"><p className="font-display text-2xl text-gold">{wedding.venue}</p><p className="mt-2 text-[12px]">{wedding.city}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${wedding.venue}, ${wedding.city}`)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[11px] underline decoration-gold/40 underline-offset-4"><MapPin className="size-3"/>Find your way to us</a></div></div><p className="font-display relative mt-8 whitespace-pre-wrap text-[16px] leading-7 text-muted-foreground">{wedding.message || "Your presence is our greatest gift. Join us as we begin a lifetime of love, laughter, and togetherness."}</p><p className="font-display relative mt-6 text-lg italic text-muted-foreground">With love, always.</p></section><section aria-label="Reply to this invitation" className="rounded-xl border border-border bg-card px-6 py-8 shadow-xs md:mt-12 sm:px-7">{wedding.deadline && <p className="mb-6 border-b border-border pb-4 text-center text-[11px] text-gold">Kindly reply by {formatDate(wedding.deadline)}</p>}<RsvpForm slug={slug} open={rsvpIsOpen(wedding)} demo={demo} previous={previous}/></section></main><footer className="pb-8 text-center"><p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">Made with <Heart className="size-3" strokeWidth={1.4}/> on <Link href="/" className="text-gold">Shaadi Reply</Link></p></footer></div>;
}
