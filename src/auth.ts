import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { credentialsSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/password";
import { allowRequest } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [Credentials({
    credentials: { email: {}, password: {} },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;
      if (!await allowRequest("login", parsed.data.email, 10)) return null;
      const user = await db().user.findUnique({ where: { email: parsed.data.email } });
      if (!user || !await verifyPassword(parsed.data.password, user.passwordHash)) return null;
      return { id: user.id, name: user.name, email: user.email };
    }
  })],
  callbacks: {
    jwt({ token, user }) { if (user) token.sub = user.id; return token; },
    session({ session, token }) { if (token.sub) session.user.id = token.sub; return session; }
  }
});
