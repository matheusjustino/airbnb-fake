import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt';

import { prismaClient } from '../../../app/libs/prisma-db';

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prismaClient),
	providers: [
		GithubProvider({
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
			clientSecret: process.env
				.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
			clientSecret: process.env
				.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: {
					label: 'email',
					type: 'text',
				},
				password: {
					label: 'email',
					type: 'password',
				},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					throw new Error('Invalid credentials');
				}

				const user = await prismaClient.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user?.hashedPassword) {
					throw new Error('Invalid credentials');
				}

				if (!compareSync(credentials.password, user.hashedPassword)) {
					throw new Error('Invalid credentials');
				}

				return user;
			},
		}),
	],
	pages: {
		signIn: '/',
	},
	debug: process.env.NEXT_PUBLIC_NODE_ENV === 'development',
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
