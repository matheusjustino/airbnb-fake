import { NextResponse } from 'next/server';

// LIBS
import { prismaClient } from '@/app/libs/prisma-db';

// UTILS
import { getCurrentUser } from '@/app/utils/get-current-user';

interface ParamsInterface {
	listingId?: string;
}

export async function DELETE(
	req: Request,
	{ params }: { params: ParamsInterface },
) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return NextResponse.error();
	}

	const { listingId } = params;
	if (!listingId || typeof listingId !== 'string') {
		throw new Error('Invalid ID');
	}

	const listing = await prismaClient.listing.deleteMany({
		where: {
			id: listingId,
			userId: currentUser.id,
		},
	});

	return NextResponse.json(listing);
}
