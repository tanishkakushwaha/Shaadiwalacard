import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
export const metadata: Metadata = { title: "Create your account" };
export default async function SignupPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return <AuthLayout title="Here’s to your forever." description="Create your account and bring all your favourite people together for your big day."><AuthForm mode="signup"/></AuthLayout>;
}
