// auth.ts  (project root)
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { getUserbyEmail } from './lib/db';

export const { auth, signIn, signOut,handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.email(), password: z.string() })
          .safeParse(credentials);

        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await getUserbyEmail(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;

        return user;
      },
    }),
  ],
   callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});