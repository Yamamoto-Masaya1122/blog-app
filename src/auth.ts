import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";

async function getUser(email: string) {
    // ユーザー取得関数
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(8),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password as string,
                );
                if (!passwordsMatch) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                if (!user || !user.email || !user.name || !user.id) {
                    console.error("ユーザー情報が不足しています");
                    return false;
                }

                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: user.email as string,
                    },
                });

                if (existingUser) {
                    console.log("すでに登録されているユーザーです");
                    return true;
                }

                await prisma.user.create({
                    data: {
                        email: user.email as string,
                        name: user.name as string,
                        googleOauthId: user.id as string,
                    },
                });

                return true;
            }
            return false;
        },
        async jwt({ token, user, account }) {
            if (user?.id) {
                token.id = user.id;
            }

            // OAuthログイン時はproviderのIDではなくDBのUser.idを保持する
            if (account?.provider === "google" && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: token.email,
                    },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.id || token.sub || "") as string;
                session.user.name = token.name ?? "";
                session.user.email = token.email ?? "";
            }
            return session;
        },
    },
});
