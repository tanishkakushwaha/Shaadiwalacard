import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { WeddingForm } from "@/components/wedding-form";
export const metadata: Metadata = { title: "Create your wedding", robots: { index: false, follow: false } };
export default async function NewWeddingPage() {
  if (!(await auth())?.user?.id) redirect("/login");
  return <WeddingForm/>;
}
