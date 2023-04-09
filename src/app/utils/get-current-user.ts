import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';

// API
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// LIBS
import { prismaClient } from '@/app/libs/prisma-db';

// TYPES
import { SafeUser } from '@/app/types';

export async function getSession(): Promise<Session | null> {
	return getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
	try {
		const session = await getSession();
		if (!session?.user?.email) {
			return null;
		}

		const currentUser = await prismaClient.user.findUnique({
			where: {
				email: session.user.email,
			},
		});

		if (!currentUser) {
			return null;
		}

		return {
			...currentUser,
			createdAt: currentUser.createdAt.toISOString(),
			updatedAt: currentUser.updatedAt.toISOString(),
			emailVerified: currentUser.emailVerified?.toISOString() || null,
		};
	} catch (error: any) {
		console.error(error);
		return null;
	}
}
