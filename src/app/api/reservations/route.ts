import { NextResponse } from 'next/server';

// LIBS
import { prismaClient } from '@/app/libs/prisma-db';

// UTILS
import { getCurrentUser } from '@/app/utils/get-current-user';

// INTERFACES
import { CreateReservationInterface } from '@/app/interfaces/create-reservation.interface';

export async function POST(req: Request) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}

	const body: CreateReservationInterface = await req.json();
	const { startDate, endDate, listingId, totalPrice } = body;

	if (!startDate || !endDate || !listingId || !totalPrice) {
		return NextResponse.error();
	}

	const listingAndReservation = await prismaClient.listing.update({
		where: {
			id: listingId,
		},
		data: {
			reservations: {
				create: {
					userId: currentUser.id,
					startDate,
					endDate,
					totalPrice,
				},
			},
		},
	});

	return NextResponse.json(listingAndReservation);
}
