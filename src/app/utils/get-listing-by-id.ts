import { SafeListing, SafeUser } from '../types';

// LIBS
import { prismaClient } from '../libs/prisma-db';

interface ParamsInterface {
	listingId?: string;
}

export async function getListingById(
	params: ParamsInterface,
): Promise<(SafeListing & { user: SafeUser }) | null> {
	try {
		const { listingId } = params;
		if (!listingId) {
			throw new Error('Invalid ID');
		}

		const listing = await prismaClient.listing.findUnique({
			where: {
				id: listingId,
			},
			include: {
				user: true,
			},
		});

		if (!listing) {
			return null;
		}

		return {
			...listing,
			createdAt: listing.createdAt.toISOString(),
			updatedAt: listing.updatedAt.toISOString(),
			user: {
				...listing.user,
				createdAt: listing.user.createdAt.toISOString(),
				updatedAt: listing.user.updatedAt.toISOString(),
				emailVerified:
					listing.user.emailVerified?.toISOString() || null,
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
}
