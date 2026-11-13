import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
export const metadata: Metadata = { title: "Welcome back" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  if ((await auth())?.user) redirect("/dashboard");
  const { registered } = await searchParams;
  return <AuthLayout title="Hello again, love." description="Your people, your plans, and all those lovely yeses. Let’s pick up where you left off."><AuthForm mode="login" registered={registered === "1"}/></AuthLayout>;
}
