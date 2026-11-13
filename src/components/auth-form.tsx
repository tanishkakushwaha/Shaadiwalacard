"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction, signupAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode, registered = false }: { mode: "login" | "signup"; registered?: boolean }) {
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signupAction : loginAction, {});
  const [show, setShow] = useState(false);
  return <form action={action} className="space-y-5">
    {registered && <p role="status" className="rounded-lg border border-success/25 bg-success-surface p-3 text-sm text-success">Your account is ready. Sign in to start your celebration.</p>}
    {isSignup && <div className="space-y-2"><label htmlFor="name" className="text-xs font-medium">Your name</label><Input id="name" name="name" autoComplete="name" placeholder="Ananya Sharma" required minLength={2} maxLength={80}/></div>}
    <div className="space-y-2"><label htmlFor="email" className="text-xs font-medium">Email address</label><Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254}/></div>
    <div className="space-y-2"><label htmlFor="password" className="text-xs font-medium">Password</label><div className="relative"><Input id="password" name="password" type={show ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "At least 10 characters" : "Enter your password"} required minLength={10} maxLength={128} className="pr-11"/><button type="button" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={()=>setShow(!show)} className="absolute inset-y-0 right-0 px-3 text-muted-foreground">{show ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}</button></div>{isSignup && <p className="text-[11px] text-muted-foreground">Make it yours. Use at least 10 characters.</p>}</div>
    {state.error && <p role="alert" className="rounded-lg border border-rose/25 bg-rose-surface p-3 text-sm text-rose">{state.error}</p>}
    <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? <><Loader2 className="animate-spin"/>One little moment…</> : <>{isSignup ? "Create your account" : "Welcome back"}<ArrowRight/></>}</Button>
    <p className="text-center text-xs text-muted-foreground">{isSignup ? "Already planning with us?" : "New beginnings?"} <Link className="font-medium text-primary underline-offset-4 hover:underline" href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link></p>
  </form>;
}
