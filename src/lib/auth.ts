// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { SessionType } from "@/types/session";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, profile }) {
            try {
                let dbUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!dbUser) {
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: (user.name || profile?.name)!,
                        },
                    });
                }

                user.id = dbUser.id.toString();
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async jwt({ token, account, user }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: SessionType, token: JWT }) {
            if (token) {
                session.user = {
                    email: token.email,
                    id: token.name,
                    image: token.picture
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
        signOut: "/signout",
        error: "/error",
    },
};