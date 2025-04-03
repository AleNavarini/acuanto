import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile }) {
      // This callback runs when a user signs in with Google
      try {
        // Check if the user already exists in the database by email
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!dbUser) {
          // If the user doesn't exist, create a new one
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: (user.name || profile?.name)!, // Google provides name in profile
            },
          });
        }

        // Attach the database user ID to the user object for session
        user.id = dbUser.id.toString();
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Deny sign-in if something goes wrong
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
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
