import { NextResponse } from 'next/server';

// LIBS
import { prismaClient } from '@/app/libs/prisma-db';

// UTILS
import { getCurrentUser } from '@/app/utils/get-current-user';

interface ParamsInterface {
	reservationId?: string;
}

export async function DELETE(
	req: Request,
	{ params }: { params: ParamsInterface },
) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}

	const { reservationId } = params;
	if (!reservationId || typeof reservationId !== 'string') {
		throw new Error('Invalid ID');
	}

	const reservation = await prismaClient.reservation.deleteMany({
		where: {
			id: reservationId,
			OR: [
				{
					userId: currentUser.id,
				},
				{
					listing: { userId: currentUser.id },
				},
			],
		},
	});

	return NextResponse.json(reservation);
}
