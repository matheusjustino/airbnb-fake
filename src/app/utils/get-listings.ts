import { SafeListing } from '../types';

// LIBS
import { prismaClient } from '../libs/prisma-db';

export async function getListings(): Promise<SafeListing[]> {
	try {
		const listings = await prismaClient.listing.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return listings.map<SafeListing>(
			({ createdAt, updatedAt, ...item }) => ({
				...item,
				createdAt: createdAt.toISOString(),
				updatedAt: updatedAt.toISOString(),
			}),
		);
	} catch (error: any) {
		throw new Error(error);
	}
}
