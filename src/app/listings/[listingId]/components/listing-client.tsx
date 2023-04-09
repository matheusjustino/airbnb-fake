'use client';

import { useMemo } from 'react';

import { Reservation } from '@prisma/client';
import { SafeListing, SafeUser } from '@/app/types';

// UTILS
import { CATEGORIES_LIST } from '@/app/utils/categories-list';

// COMPONENTS
import Container from '@/app/components/container';
import ListingHead from '@/app/components/listings/listing-head';
import ListingInfo from '@/app/components/listings/listing-info';

interface ListingClientProps {
	listing: SafeListing & { user: SafeUser };
	currentUser: SafeUser | null;
	reservations?: Reservation[];
}

const ListingClient: React.FC<ListingClientProps> = ({
	listing,
	currentUser,
	reservations,
}) => {
	const category = useMemo(() => {
		return CATEGORIES_LIST.find((item) => item.label === listing.category);
	}, [listing]);

	return (
		<Container>
			<div className="max-w-screen-lg mx-auto">
				<div className="flex flex-col gap-6">
					<ListingHead
						title={listing.title}
						imageSrc={listing.imageSrc}
						locationValue={listing.locationValue}
						id={listing.id}
						currentUser={currentUser}
					/>

					<div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
						<ListingInfo
							user={listing.user}
							category={category}
							description={listing.description}
							roomCount={listing.roomCount}
							guestCount={listing.guestCount}
							bathroomCount={listing.bathroomCount}
							locationValue={listing.locationValue}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default ListingClient;
