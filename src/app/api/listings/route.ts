import { NextResponse } from 'next/server';

// INTERFACES
import { CreateListingInterface } from '@/app/interfaces/create-listing.interface';

// UTILS
import { getCurrentUser } from '@/app/utils/get-current-user';

// LIBS
import { prismaClient } from '@/app/libs/prisma-db';

export async function POST(req: Request) {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return NextResponse.error();
	}

	const bodyJson = await req.json();
	Object.keys(bodyJson).forEach((value: string) => {
		if (!bodyJson[value]) {
			NextResponse.error();
		}
	});

	const {
		category,
		guestCount,
		roomCount,
		bathroomCount,
		imageSrc,
		price,
		title,
		description,
		location,
	} = bodyJson as CreateListingInterface;

	const listing = await prismaClient.listing.create({
		data: {
			category,
			guestCount,
			roomCount,
			bathroomCount,
			imageSrc,
			title,
			description,
			price: parseInt(String(price), 10),
			locationValue: location.value,
			userId: currentUser.id,
		},
	});

	return NextResponse.json(listing);
}
