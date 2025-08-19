import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { SessionStrategy, DefaultSession, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { compare } from "bcryptjs";
import { CoinSystem } from "./coin-system";

// Create a single instance of CoinSystem
const coinSystem = new CoinSystem();

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstLogin: boolean;
    } & DefaultSession["user"];
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstLogin: boolean;
  }
}

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          firstLogin: user.firstLogin ?? true,
          isAdmin: user.isAdmin ?? false
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // If user is present (on login), set isAdmin from user object
      if (user) {
        token.id = user.id;
        token.firstLogin = user.firstLogin ?? true;
        token.isAdmin = user.isAdmin ?? false;
      } else if (token?.id) {
        // On subsequent requests, fetch isAdmin from DB if not present
        if (typeof token.isAdmin === 'undefined') {
          const dbUser = await prisma.user.findUnique({ where: { id: token.id } });
          token.isAdmin = dbUser?.isAdmin ?? false;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.firstLogin = token.firstLogin;
        session.user.isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },
  events: {
    async signIn(message: { user: any; isNewUser?: boolean }) {
      // If it's a new user or firstLogin is still true
      if (message.isNewUser || message.user.firstLogin) {
        await prisma.user.update({
          where: { id: message.user.id },
          data: { firstLogin: false },
        });
      }
      
      // Award coins for new user signup
      if (message.isNewUser) {
        await CoinSystem.awardCoins(message.user.id, 'PROFILE_COMPLETE');
      }
      // Award daily login bonus
      await CoinSystem.awardCoins(message.user.id, 'DAILY_LOGIN');
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;