import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const NEXTAUTH_SECRET = "super_secret_jahid_host_2026_xyz123";
const FLASK_URL = "http://160.236.58.192:5000";
const API_KEY = "CHANGE_ME_API_KEY";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // 🐍 Python Flask-এ রিকোয়েস্ট পাঠাচ্ছে
          const res = await fetch(`${FLASK_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          
          if (!res.ok) return null;
          const data = await res.json();
          
          // NextAuth সেশন তৈরি হবে
          return { id: data.user.id.toString(), email: data.user.email };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.uid;
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
};
