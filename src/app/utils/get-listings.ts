import { SafeListing } from '../types';

// LIBS
import { prismaClient } from '../libs/prisma-db';

export interface GetListingsParamsInterface {
	userId?: string;
	guestCount?: number;
	roomCount?: number;
	bathRoomCount?: number;
	startDate?: string;
	endDate?: string;
	locationValue?: string;
	category?: string;
}

export async function getListings(
	params: GetListingsParamsInterface = {},
): Promise<SafeListing[]> {
	try {
		const {
			userId,
			guestCount,
			roomCount,
			bathRoomCount,
			startDate,
			endDate,
			locationValue,
			category,
		} = params;
		const query: Record<string, any> = {
			...(userId && { userId }),
			...(guestCount && { guestCount: { gte: +guestCount } }),
			...(roomCount && { roomCount: { gte: +roomCount } }),
			...(bathRoomCount && { bathRoomCount: { gte: +bathRoomCount } }),
			...(locationValue && { locationValue }),
			...(category && { category }),
		};

		if (startDate && endDate) {
			query.NOT = {
				reservations: {
					some: {
						OR: [
							{
								endDate: { gte: startDate },
								startDate: { lte: startDate },
							},
							{
								startDate: { lte: endDate },
								endDate: { gte: endDate },
							},
						],
					},
				},
			};
		}

		const listings = await prismaClient.listing.findMany({
			where: query,
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
