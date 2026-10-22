import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const NEXTAUTH_SECRET = "super_secret_jahid_host_2026_xyz123";
const FLASK_URL = "http://160.236.58.192:5000";
const API_KEY = "1e22d35fcacf16246a549d7b3489ae7836d0816315ab93aa";

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
          console.log("Trying to connect to VPS...");
          const res = await fetch(`${FLASK_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          
          if (!res.ok) {
            console.log("VPS returned error status:", res.status);
            return null; // ফেইল হলে null রিটার্ন করবে
          }
          
          const data = await res.json();
          return { id: data.user.id.toString(), email: data.user.email };
        } catch (error) {
          console.error("VPS Connection Error:", error);
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
