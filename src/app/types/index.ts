import { Listing, Reservation, User } from '@prisma/client';

export type SafeUser = Omit<
	User,
	'createdAt' | 'updatedAt' | 'emailVerified'
> & {
	createdAt: string;
	updatedAt: string;
	emailVerified: string | null;
};

export type SafeListing = Omit<Listing, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

export type SafeReservation = Omit<
	Reservation,
	'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'listing'
> & {
	listing: SafeListing;
	startDate: string;
	endDate: string;
	createdAt: string;
	updatedAt: string;
};
