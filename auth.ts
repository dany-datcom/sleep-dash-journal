import { getServerSession } from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserForAuth } from '@/lib/db';

const AUTH_SECRET =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  'sleep-journal-development-secret';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await getUserForAuth(email);

        if (!user || user.password !== password) {
          return null;
        }

        return {
          id: String(user.user_id),
          email: user.email,
          name: [user.first_name, user.last_name].filter(Boolean).join(' '),
        };
      },
    }),
  ],
  pages: {
    signIn: '/journal',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },
  secret: AUTH_SECRET,
};

export const auth = async () => {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
};