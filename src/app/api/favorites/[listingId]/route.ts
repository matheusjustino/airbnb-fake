import { NextResponse } from 'next/server';

import { prismaClient } from '@/app/libs/prisma-db';

// UTILS
import { getCurrentUser } from '@/app/utils/get-current-user';

interface ParamsInterface {
	listingId?: string;
}

export async function POST(
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

	const favoriteIds = [...(currentUser.favoriteIds || [])].concat(listingId);

	const user = await prismaClient.user.update({
		where: {
			id: currentUser.id,
		},
		data: {
			favoriteIds,
		},
	});

	return NextResponse.json(user);
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

	const favoriteIds = [...(currentUser.favoriteIds || [])].filter(
		(id) => id !== listingId,
	);

	const user = await prismaClient.user.update({
		where: {
			id: currentUser.id,
		},
		data: {
			favoriteIds,
		},
	});

	return NextResponse.json(user);
}
