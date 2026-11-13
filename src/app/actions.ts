"use server";

import { createHash, randomBytes } from "node:crypto";
import { AuthError } from "next-auth";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { allowRequest } from "@/lib/rate-limit";
import { rsvpIsOpen } from "@/lib/dates";
import { credentialsSchema, signupSchema, weddingSchema, responseSchema, type ActionState } from "@/lib/validation";

export async function loginAction(_previous: ActionState, form: FormData): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "We couldn’t sign you in. Check your email and password, or try again in a few minutes." };
    throw error;
  }
  return {};
}

export async function signupAction(_previous: ActionState, form: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (!await allowRequest("signup", ip, 10, 60)) return { error: "Too many attempts. Please try again in an hour." };
    const { name, email, password } = parsed.data;
    await db().user.create({ data: { name, email, passwordHash: await hashPassword(password) } });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { error: "We couldn’t create an account with that email. Try signing in instead." };
    }
    console.error("Account creation failed", error);
    return { error: "Account creation is temporarily unavailable. Please try again later." };
  }
  redirect("/login?registered=1");
}

export async function logoutAction() { await signOut({ redirectTo: "/" }); }

export async function saveWeddingAction(id: string | null, _previous: ActionState, form: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const parsed = weddingSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  let weddingId: string;
  try {
    const { deadline, date, ...rest } = parsed.data;
    const data = { ...rest, date: new Date(`${date}T00:00:00Z`), deadline: deadline ? new Date(`${deadline}T00:00:00Z`) : null };
    if (id) {
      const result = await db().wedding.updateMany({ where: { id, ownerId: session.user.id }, data });
      if (!result.count) return { error: "This wedding could not be found." };
      weddingId = id;
    } else {
      const prefix = `${rest.partnerOne}-${rest.partnerTwo}`.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 45) || "our-wedding";
      const wedding = await db().wedding.create({ data: { ...data, ownerId: session.user.id, slug: `${prefix}-${randomBytes(10).toString("hex")}` } });
      weddingId = wedding.id;
    }
  } catch (error) {
    console.error("Wedding save failed", error);
    return { error: "We couldn’t save your wedding. Please try again." };
  }
  revalidatePath("/dashboard");
  redirect(`/dashboard?event=${weddingId}`);
}

export async function toggleRepliesAction(id: string, open: boolean): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in again." };
  try {
    const wedding = await db().wedding.findFirst({ where: { id, ownerId: session.user.id }, select: { slug: true } });
    if (!wedding) return { error: "This wedding could not be found." };
    await db().wedding.updateMany({ where: { id, ownerId: session.user.id }, data: { isOpen: open } });
    revalidatePath("/dashboard");
    revalidatePath(`/rsvp/${wedding.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Reply status update failed", error);
    return { error: "We couldn’t update your invitation. Please try again." };
  }
}

export async function submitRsvpAction(slug: string, _previous: ActionState, form: FormData): Promise<ActionState> {
  const parsed = responseSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const wedding = await db().wedding.findUnique({ where: { slug }, select: { id: true, isOpen: true, deadline: true } });
    if (!wedding) return { error: "This invitation could not be found." };
    if (!rsvpIsOpen(wedding)) return { error: "Replies have closed. Please contact the couple directly." };
    const jar = await cookies();
    const cookieName = `shaadi-rsvp-${wedding.id}`;
    const existing = jar.get(cookieName)?.value;
    const token = existing && /^[a-f0-9]{64}$/.test(existing) ? existing : randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (!await allowRequest("rsvp", `${wedding.id}:${ip}`, 60)) return { error: "Too many replies just now. Please try again in 15 minutes." };
    const { attending, ...rest } = parsed.data;
    const data = { ...rest, attending: attending === "yes", guests: attending === "yes" ? rest.guests : 0 };
    await db().response.upsert({
      where: { weddingId_tokenHash: { weddingId: wedding.id, tokenHash } },
      create: { ...data, weddingId: wedding.id, tokenHash },
      update: data
    });
    jar.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("RSVP submission failed", error);
    return { error: "Your reply couldn’t be saved. Please try again." };
  }
}
