import { SafeListing } from '../types';

// UTILS
import { prismaClient } from '../libs/prisma-db';
import { getCurrentUser } from './get-current-user';

export async function getFavoritesListings(): Promise<SafeListing[]> {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) {
			return [];
		}

		const favorites = await prismaClient.listing.findMany({
			where: {
				id: {
					in: [...(currentUser.favoriteIds || [])],
				},
			},
		});

		return favorites.map<SafeListing>((item) => ({
			...item,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));
	} catch (error: any) {
		throw new Error(error);
	}
}
