import { z } from "zod";
import { isValidDate } from "@/lib/dates";

const name = z.string().trim().min(2, "Please enter at least 2 characters.").max(80, "Please use at most 80 characters.");
export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  password: z.string().min(10, "Use a password with at least 10 characters.").max(128)
});
export const signupSchema = credentialsSchema.extend({ name });
export const weddingSchema = z.object({
  partnerOne: name,
  partnerTwo: name,
  date: z.string().refine(isValidDate, "Choose a valid wedding date."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid time."),
  venue: z.string().trim().min(2, "Enter your venue.").max(180),
  city: z.string().trim().min(2, "Enter your city.").max(100),
  message: z.string().trim().max(1000, "Keep your note within 1,000 characters."),
  deadline: z.string().refine(v => !v || isValidDate(v), "Choose a valid RSVP deadline.")
}).refine(v => !v.deadline || v.deadline <= v.date, { message: "The RSVP deadline must be on or before your wedding.", path: ["deadline"] });
export const responseSchema = z.object({
  name,
  attending: z.enum(["yes", "no"], { error: "Let us know if you can attend." }),
  guests: z.coerce.number().int().min(1).max(10),
  message: z.string().trim().max(500, "Keep your note within 500 characters.")
});

export type ActionState = { error?: string; success?: boolean };
