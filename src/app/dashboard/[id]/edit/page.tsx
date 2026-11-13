import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { WeddingForm } from "@/components/wedding-form";
export const metadata: Metadata = { title: "Edit your wedding", robots: { index: false, follow: false } };
export default async function EditWeddingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const w = await db().wedding.findFirst({ where: { id, ownerId: session.user.id }, select: { id: true, partnerOne: true, partnerTwo: true, date: true, deadline: true, time: true, venue: true, city: true, message: true } });
  if (!w) notFound();
  return <WeddingForm initial={{...w,date:w.date.toISOString().slice(0,10),deadline:w.deadline?.toISOString().slice(0,10)??null}}/>;
}
