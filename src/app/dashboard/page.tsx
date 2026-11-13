import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Dashboard } from "@/components/dashboard";
export const metadata: Metadata = { title: "Your wedding dashboard", robots: { index: false, follow: false } };
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { event } = await searchParams;
  const records = await db().wedding.findMany({ where: { ownerId: session.user.id }, orderBy: { createdAt: "desc" }, include: { responses: { orderBy: { updatedAt: "desc" }, select: { id: true, name: true, attending: true, guests: true, message: true, updatedAt: true } } } });
  const weddings = records.map(({ ownerId: _owner, createdAt: _created, updatedAt: _updated, ...w })=>({ ...w, date: w.date.toISOString().slice(0,10), deadline: w.deadline?.toISOString().slice(0,10) ?? null, responses: w.responses.map(r=>({...r,updatedAt:r.updatedAt.toISOString()})) }));
  return <Dashboard user={{ name: session.user.name ?? "Love", email: session.user.email }} weddings={weddings} selectedId={event}/>;
}
