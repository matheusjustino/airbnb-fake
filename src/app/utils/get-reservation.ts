import { prismaClient } from '../libs/prisma-db';
import { SafeListing, SafeReservation } from '../types';

interface ParamsInterface {
	listingId?: string;
	userId?: string;
	authorId?: string;
}

export async function getReservations(
	params: ParamsInterface,
): Promise<SafeReservation[]> {
	try {
		const { listingId, userId, authorId } = params;

		const query = {
			...(listingId && { listingId }),
			...(userId && { userId }),
			...(authorId && { listing: { userId: authorId } }),
		};

		const reservations = await prismaClient.reservation.findMany({
			where: query,
			include: {
				listing: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const safeReservations = reservations.map<
			SafeReservation & { listing: SafeListing }
		>((reservation) => ({
			...reservation,
			listing: {
				...reservation.listing,
				createdAt: reservation.listing.createdAt.toISOString(),
				updatedAt: reservation.listing.updatedAt.toISOString(),
			},
			startDate: reservation.startDate.toISOString(),
			endDate: reservation.endDate.toISOString(),
			createdAt: reservation.createdAt.toISOString(),
			updatedAt: reservation.updatedAt.toISOString(),
		}));

		return safeReservations;
	} catch (error: any) {
		throw new Error(error);
	}
}
