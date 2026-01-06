import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        
        if (user && bcrypt.compareSync(credentials?.password as string, user.password)) {
          return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as string;
      return session;
    },
  },
});