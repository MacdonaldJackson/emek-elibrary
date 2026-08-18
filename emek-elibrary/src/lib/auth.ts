import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
    session: {
          // JWT sessions — no NextAuth Account/Session tables needed since we
      // only support the Credentials provider.
      strategy: "jwt",
    },
    pages: {
          signIn: "/login",
    },
    providers: [
          CredentialsProvider({
                  name: "Email and password",
                  credentials: {
                            email: { label: "Email", type: "email" },
                            password: { label: "Password", type: "password" },
                  },
                  async authorize(credentials) {
                            if (!credentials?.email || !credentials?.password) {
                                        throw new Error("Email and password are required.");
                            }

                    const user = await prisma.user.findUnique({
                                where: { email: credentials.email.toLowerCase().trim() },
                    });

                    if (!user) {
                                throw new Error("No account found with that email.");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                            if (!isValid) {
                                        throw new Error("Incorrect password.");
                            }

                    return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                    };
                  },
          }),
        ],
    callbacks: {
          async jwt({ token, user }) {
                  if (user) {
                            token.id = user.id;
                            token.role = user.role;
                  }
                  return token;
          },
          async session({ session, token }) {
                  if (session.user) {
                            session.user.id = token.id as string;
                            session.user.role = token.role as "USER" | "ADMIN";
                  }
                  return session;
          },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
